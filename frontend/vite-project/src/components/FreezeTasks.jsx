// FreezeTasks.jsx
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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
import axiosInstance from '../axios';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';

const statusOptions = ['Yes', 'No', 'Failed'];

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
    const { rows, setRows, setRowModesModel, setError } = props;
    const handleClick = () => {
        const lastId = rows.length > 0 ? rows[rows.length - 1].id : 0;
        const newId = lastId + 1;
        const today = dayjs().toISOString(); // today's date in ISO format
        const newTask = {
            id: newId,
            strain: '',
            requestor: '',
            request_date: today,
            submission_status: 'No',
            freezing_status: 'No',
            test_thaws_status: 'No',
            thaw_check_status: 'No',
            filed_in: '',
            comments: '',
            isNew: true, // Set isNew to true for new tasks
        };

        setRows((oldRows) => [...oldRows, newTask]);
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

export default function FreezeTasks() {
    const [rows, setRows] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});
    const [error, setError] = useState('');
    const [availableStrains, setAvailableStrains] = useState([]);
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

    const handleDeleteClick = (id) => () => {
        try {
            axios.delete(`http://localhost:8000/model/freezes/${id}/`);
            setRows(rows.filter((row) => row.id !== id));
        } catch (error) {
            console.error('Error deleting freeze task:', error);
            setError('Error deleting freeze task. Please try again.');
        }

    };
    // const handleDeleteClick = async (id) => {
    //     try {
    //         await axios.delete(`http://localhost:8000/freezes/${id}/`);
    //         setRows(rows.filter((row) => row.id !== id));
    //     } catch (error) {
    //         console.error('Error deleting freeze task:', error);
    //         setError('Error deleting freeze task. Please try again.');
    //     }
    // };

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

    // const processRowUpdate = (newRow) => {
    //     const updatedRow = { ...newRow, isNew: false };
    //     setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    //     return updatedRow;
    // };

    const processRowUpdate = async (newRow, oldRow) => {
        const updatedRow = { ...newRow };
        // console.log(updatedRow.isNew);
        // console.log(updatedRow);
        // Format the request_date to "YYYY-MM-DD"
        if (updatedRow.request_date) {
            updatedRow.request_date = dayjs(updatedRow.request_date).format('YYYY-MM-DD');
        }
        // if (!updatedRow.strain) {
        //     updatedRow.strain = "";
        // }
        try {
            if (newRow.isNew) {
                // If the row is new, create a new record in the database
                const response = await axios.post('http://localhost:8000/model/freezes/', updatedRow);
                const createdTask = response.data;
                setRows((prevRows) => prevRows.map((row) => (row.id === newRow.id ? { ...createdTask, isNew: false } : row)));
                return { ...createdTask, isNew: false };
            } else {
                // If the row already exists, update the record in the database
                const response = await axios.put(`http://localhost:8000/model/freezes/${newRow.id}/`, updatedRow);
                const updatedTask = response.data;
                setRows((prevRows) => prevRows.map((row) => (row.id === newRow.id ? updatedTask : row)));
                return updatedTask;
            }
        } catch (error) {
            console.error('Error saving/updating freeze task:', error);
            setError('Error saving/updating freeze task. Please try again.');

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
            field: 'comments', headerName: 'Comments', width: 150, editable: true,
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
            )
        },
        {
            field: 'submission_status',
            headerName: 'Submission plates?',
            width: 150,
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
            field: 'freezing_status',
            headerName: 'Strain frozen?',
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
            field: 'test_thaws_status',
            headerName: 'Test thawed?',
            width: 130,
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
            field: 'thaw_check_status',
            headerName: 'Test thaw passed?',
            width: 150,
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
            field: 'filed_in', headerName: 'Filed In', width: 100, editable: true,
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
                {error && (
                    <Alert severity="error" onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}
                <DataGrid
                    rows={rows}
                    columns={columns}
                    editMode="row"
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    slots={{
                        toolbar: EditToolbar,
                    }}
                    slotProps={{
                        toolbar: { rows, setRows, setRowModesModel, setError },
                    }}
                />
            </div>
        </LocalizationProvider>
    );
}