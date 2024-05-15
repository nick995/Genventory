import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AlertDialog from './AlertDialog';
import axiosInstance from '../axios';

import {
    DataGrid,
    GridActionsCellItem,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarExport,
    GridToolbarDensitySelector,
    GridToolbarQuickFilter,
} from '@mui/x-data-grid';


function CustomToolbar() {
    const navigate = useNavigate();
    return (
        <GridToolbarContainer>
            <Button
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => navigate('/model/strains/create')}>
                Add Strain
            </Button>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport />
            <GridToolbarQuickFilter />
        </GridToolbarContainer>
    );
}


const fetchStrains = async () => {
    try {
        const response = await fetch('http://localhost:8000/model/strains/');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (e) {
        console.log(e);
        return [];
    }
};

const deleteStrain = async (id) => {
    try {
        await axiosInstance.delete(`model/strains/${id}`);
        return true;
    } catch (error) {
        console.error('Failed to delete strain.', error);
        throw error;
    }
};


export default function StrainsTable() {
    const [strains, setStrains] = React.useState([]);
    const [columns, setColumns] = React.useState([]);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [itemToDelete, setItemToDelete] = React.useState(null);
    const navigate = useNavigate();


    const handleConfirmDelete = async (item) => {
        try {
            await deleteStrain(item.id);
            setStrains(strains.filter(strain => strain.id !== item.id)); // Remove allele from local state
            setOpenDialog(false); // Close the dialog
        } catch (error) {
            console.error('Failed to delete strain', error);
        }
    };


    React.useEffect(() => {
        fetchStrains().then(data => {
            setStrains(data);
            if (data.length > 0) {
                const firstItem = data[0];
                const generatedColumns = Object.keys(firstItem).map(key => ({
                    field: key,
                    headerName: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
                    width: 150,
                    editable: false,
                    ...(key === 'position' && { width: 100 }),
                    ...(key === 'date_entered' && { width: 100 }),
                    ...(key === 'ordered_geno_type' && { width: 300 }),
                    ...(key === 'notes' && { width: 200 }),
                })).concat({
                    field: 'actions',
                    type: 'actions',
                    headerName: 'Actions',
                    getActions: (params) => [
                        <GridActionsCellItem
                            icon={<EditIcon />}
                            label="Edit"
                            onClick={() => navigate(`/model/strains/edit/${params.id}`)}
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
    }, []);

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <DataGrid
                rows={strains}
                columns={columns}
                slots={{ toolbar: CustomToolbar }}
                initialState={{
                    columns: {
                        columnVisibilityModel: { //Hide columns by default (all false columns shall be deleted from backend except id & isolation_number) Strain Name should be added to DB to be displayed
                            id: false, //** 
                            allele_genotype: false,
                            gene_genotype: false,
                            geno_type_new: false,
                            geno_type_old: false,
                            background_geno_type: false,
                            EG_number: false,
                            EG_global: false,
                            global1: false,
                            isolation_number: false, //**
                            lost_designation: false,
                            lost_check: false,
                            lost_date: false,
                            lost_person: false,
                            alleles: false,
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
