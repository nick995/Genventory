// ThawTasks.jsx
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import MenuItem from '@mui/material/MenuItem';
import {
    DataGrid,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowModes,
    GridRowEditStopReasons,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarDensitySelector,
    GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import dayjs from 'dayjs';
import Tooltip from '@mui/material/Tooltip';
import Autocomplete from '@mui/material/Autocomplete';
import { Typography} from '@mui/material';
import Chip from '@mui/material/Chip';
import axiosInstance from '../axios';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';




const statusOptions = ['Yes', 'No', 'Failed'];
// locationOptions = ['-70°C 4th Floor', '-70°C 3rd Floor', '15°C', 'Liquid N2']
const currentLocationOptions = ['-70°C 4th Floor', '-70°C 3rd Floor', '15°C', 'Liquid N2'];

function getStatusIcon(status) {
    switch (status) {
        case 'Yes':
            return <CheckCircleIcon color="success" />;
        case 'No':
            return <CancelOutlinedIcon color="error" />;
        case 'Failed':
            return <ErrorOutlineIcon color="warning" />;
        default:
            return null;
    }
}

function EditToolbar(props) {
    const { rows, setRows, setRowModesModel } = props;

    const handleClick = () => {
        const lastId = rows.length > 0 ? rows[rows.length - 1].id : 0;
        const newId = lastId + 1;
        const today = dayjs().toISOString();
        setRows((oldRows) => [
            ...oldRows,
            {
                id: newId,
                request_date: today,
                strain: '',
                requestor: '',
                comments: '',
                thaw_done: false,
                refreeze: false,
                current_location: [],
                isNew: true,
            },
        ]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [newId]: { mode: GridRowModes.Edit, fieldToFocus: 'strain' },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Add New Task
            </Button>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <GridToolbarQuickFilter />
        </GridToolbarContainer>
    );
}

export default function ThawTasks() {
    const [rows, setRows] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});
    const [availableStrains, setAvailableStrains] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const thawsResponse = await axiosInstance.get('http://localhost:8000/model/thaws/');
                setRows(thawsResponse.data);
    
                const strainsResponse = await axiosInstance.get('http://localhost:8000/model/strains/');
                setAvailableStrains(strainsResponse.data);  // Store complete strain objects
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    
        fetchData();
    }, []);


    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id) => async () => {

        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });

    };
    

    const handleDeleteClick = (id) => async () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await axiosInstance.delete(`http://localhost:8000/model/thaws/${id}/`);
                setRows(rows.filter(row => row.id !== id));
            } catch (error) {
                console.error('Error deleting thaw task:', error);
                setError('Error deleting thaw task. Please try again.');
            }
        }
    };


    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = async (newRow, oldRow) => {
        const updatedRow = { ...newRow };
        console.log(updatedRow.isNew);
        console.log(updatedRow);

        // Format the request_date to "YYYY-MM-DD"
        if (updatedRow.request_date) {
            updatedRow.request_date = dayjs(updatedRow.request_date).format('YYYY-MM-DD');
        }
        try {
            if (newRow.isNew) {
                // If the row is new, create a new record in the database
                const response = await axios.post('http://localhost:8000/model/thaws/', updatedRow);
                const createdTask = response.data;
                setRows((prevRows) => prevRows.map((row) => (row.id === newRow.id ? { ...createdTask, isNew: false } : row)));
                return { ...createdTask, isNew: false };
            } else {
                // If the row already exists, update the record in the database
                const response = await axios.put(`http://localhost:8000/model/thaws/${newRow.id}/`, updatedRow);
                const updatedTask = response.data;
                setRows((prevRows) => prevRows.map((row) => (row.id === newRow.id ? updatedTask : row)));
                return updatedTask;
            }
        } catch (error) {
            console.error('Error saving/updating thaw task:', error);
            setError('Error saving/updating thaw task. Please try again.');

            // Return the old row to revert the changes in the UI
            return oldRow;
        }
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };
    const navigate = useNavigate();

    const columns = [
        {
            field: 'request_date',
            headerName: 'Request Date',
            width: 155,
            editable: true,
            valueFormatter: (params) => {
                return params.value ? dayjs(params.value).format('YYYY-MM-DD') : '';
            },
            renderEditCell: (params) => {
                const valueForDatePicker = params.value ? dayjs(params.value) : null;
                return (
                    <DatePicker
                        value={valueForDatePicker}
                        onChange={(newValue) => {
                            const isoDate = newValue ? newValue.toISOString() : null;
                            params.api.setEditCellValue({ id: params.id, field: params.field, value: isoDate });
                        }}
                        slotProps={{ textField: { variant: 'outlined' } }}
                    />
                );
            },
        },
        {
            field: 'strain',
            headerName: 'Strain',
            width: 100,
            editable: true,
            renderCell: (params) => {
                const strainObject = availableStrains.find(s => s.name === params.value);
                const strainId = strainObject ? strainObject.id : null;
                return (
                    <Button
                        onClick={() => strainId ? navigate(`/model/strains/edit/${strainId}`) : console.log('Strain not found')}
                        style={{ textTransform: 'none' }}
                    >
                        {params.value}
                    </Button>
                );
            },
            renderEditCell: (params) => (
                <Autocomplete
                    value={params.value}
                    onChange={(event, newValue) => {
                        params.api.setEditCellValue({ id: params.id, field: params.field, value: newValue });
                    }}
                    options={availableStrains.map(s => s.name)}
                    renderInput={(params) => (
                        <TextField {...params} label="Strain" variant="outlined" />
                    )}
                />
            ),
        },
        { field: 'requestor', headerName: 'Requestor', width: 100, editable: true },
        {
            field: 'comments',
            headerName: 'Comments',
            width: 150,
            editable: true,
            renderCell: (params) => (
                <Tooltip title={params.value}>
                    <span
                        style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {params.value}
                    </span>
                </Tooltip>
            ),
        },
        {
            field: 'thaw_done',
            headerName: 'Thaw done?',
            width: 120,
            editable: true,
            type: 'singleSelect',
            valueOptions: statusOptions,
            renderCell: (params) => {
                const icon = getStatusIcon(params.value); 
                return ( // line below is line 266 (error line)
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {icon}
                        {params.value}
                    </Box>
                );
            },
            renderEditCell: (params) => (
                <Select
                    value={params.value}
                    fullWidth
                    onChange={(event) => { 
                        params.api.setEditCellValue({ id: params.id, field: params.field, value: event.target.value });
                    }}
                    size="small"
                >
                    {statusOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            ),
        },
        {
            field: 'refreeze',
            headerName: 'Refreeze?',
            width: 120,
            editable: true,
            type: 'singleSelect',
            valueOptions: statusOptions,
            renderCell: (params) => {
                const icon = getStatusIcon(params.value);
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {icon}
                        {params.value}
                    </Box>
                );
            },
            renderEditCell: (params) => (
                <Select
                    value={params.value}
                    fullWidth
                    onChange={(event) => {
                        params.api.setEditCellValue({ id: params.id, field: params.field, value: event.target.value });
                    }}
                    size="small"
                >
                    {statusOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            ),
        },
        {
            field: 'current_location',
            headerName: 'Current Location',
            width: 425,
            editable: true,
            align: 'left',
            renderCell: (params) => {
                const locations = Array.isArray(params.value) ? params.value : [];
                return (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'left', gap: 1, padding: 1 }}>
                        {locations.map((location, index) => (
                            <Chip key={index} label={location} />
                        ))}
                    </Box>
                );
            },
            renderEditCell: (params) => (
                <Autocomplete
                    multiple
                    value={params.value || []}  // Ensure value is always an array
                    options={currentLocationOptions}
                    onChange={(event, newValue) => {
                        params.api.setEditCellValue({ id: params.id, field: params.field, value: newValue });
                    }}
                    sx={{ width: 430, pt: 1 }}
                    renderInput={(params) => <TextField {...params} variant="standard" label="Locations" />}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip key={index} label={option} {...getTagProps({ index })} />
                        ))
                    }
                />
            ),
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            onClick={handleCancelClick(id)}
                        />,
                    ];
                }
                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        onClick={handleEditClick(id)}
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                    />,
                ];
            },
        },
    ];

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div style={{ height: '100vh', width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    editMode="row"
                    getRowHeight={() => 'auto'}
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    slots={{
                        toolbar: () => <EditToolbar rows={rows} setRows={setRows} setRowModesModel={setRowModesModel} />
                    }}
                />
            </div>
        </LocalizationProvider>
    );
}