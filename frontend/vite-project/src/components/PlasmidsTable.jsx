import * as React from 'react';
import {
    DataGrid, GridActionsCellItem, GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarExport,
    GridToolbarDensitySelector,
    GridToolbarQuickFilter
} from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AlertDialog from './AlertDialog';
import axiosInstance from '../axios';


const fetchData = async () => {
    try {
        const response = await axiosInstance.get('http://localhost:8000/model/plasmids/');

        return response.data;
    } catch (e) {
        console.error(e);
        return [];
    }
};

// Function to delete a plasmid (adjusted to integrate with backend)
const deletePlasmid = async (id) => {
    try {
        await axiosInstance.delete(`model/plasmids/${id}`);
        return true;
    } catch (error) {
        console.error('Failed to delete plasmid', error);
        throw error;
    }
};

function CustomToolbar() {
    const navigate = useNavigate();
    return (
        <GridToolbarContainer>
            <Button
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => navigate('/model/plasmids/create')}>
                Add Plasmid
            </Button>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport />
            <GridToolbarQuickFilter />
        </GridToolbarContainer>
    );
}

export default function PlasmidsTable() {
    const [plasmids, setPlasmids] = React.useState([]);
    const [columns, setColumns] = React.useState([]);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [itemToDelete, setItemToDelete] = React.useState(null);
    const navigate = useNavigate();

    // Function to call when confirming deletion (integrated with backend)
    const handleConfirmDelete = async (item) => {
        try {
            await deletePlasmid(item.id);
            setPlasmids(plasmids.filter(plasmid => plasmid.id !== item.id));
            setOpenDialog(false); // Close the dialog
        } catch (error) {
            console.error('Failed to delete plasmid', error);
        }
    };

    React.useEffect(() => {
        fetchData().then(data => {
            setPlasmids(data);
            if (data.length > 0) {
                const firstItem = data[0];
                const generatedColumns = Object.keys(firstItem).map(key => ({
                    field: key,
                    headerName: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
                    width: 150,
                    editable: false,
                })).concat({
                    field: 'actions',
                    type: 'actions',
                    headerName: 'Actions',
                    getActions: (params) => [
                        <GridActionsCellItem
                            icon={<EditIcon />}
                            label="Edit"
                            onClick={() => navigate(`/model/plasmids/edit/${params.id}`)}
                        />,
                        <GridActionsCellItem
                            icon={<DeleteIcon style={{ color: 'red' }} />}
                            label="Delete"
                            onClick={() => {
                                setItemToDelete(params.row);
                                setOpenDialog(true);
                            }}
                        />,
                    ],
                    width: 100,
                });
                setColumns(generatedColumns);
            }
        });
    }, [navigate]);

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <DataGrid
                rows={plasmids}
                columns={columns}
                slots={{ toolbar: CustomToolbar }}
                initialState={{
                    columns: {
                        columnVisibilityModel: {
                            checkbox: false,
                            id: false,
                            create_at: false,
                            constructed_by: false,
                            vector: false,
                            reference: false,
                            summary_of_construction: false,
                        },
                    },
                    pagination: {
                        pageSize: 5,
                    },
                }}
                pageSize={5}
                rowsPerPageOptions={[5, 10]}
                checkboxSelection
            />
            <AlertDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onConfirm={() => handleConfirmDelete(itemToDelete)}
                item={itemToDelete}
            />
        </div>
    );
}
