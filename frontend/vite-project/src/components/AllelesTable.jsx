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
        onClick={() => navigate('/model/alleles/create')}>
        Add Allele
      </Button>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );
}


const fetchAlleles = async () => {
  try {
    const response = await fetch('http://localhost:8000/model/alleles/');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const deleteAllele = async (id) => {
  try {
      await axiosInstance.delete(`model/alleles/${id}`);
      return true;
  } catch (error) {
      console.error('Failed to delete allele.', error);
      throw error;
  }
};


export default function AllelesTable() {
  const [alleles, setAlleles] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState(null);
  const navigate = useNavigate();

  const handleConfirmDelete = async (item) => {
    try {
      await deleteAllele(item.id);
      setAlleles(alleles.filter(allele => allele.id !== item.id)); // Remove allele from local state
      setOpenDialog(false); // Close the dialog
    } catch (error) {
      console.error('Failed to delete allele', error);
    }
  };

  React.useEffect(() => {
    fetchAlleles().then(data => {
      setAlleles(data);
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
              icon={<EditIcon/>}
              label="Edit"
              onClick={() => navigate(`/model/alleles/edit/${params.id}`)}
            />,
            <GridActionsCellItem
              icon={<DeleteIcon style={{ color: 'red' }}/>}
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
        rows={alleles}
        columns={columns}
        slots={{ toolbar: CustomToolbar }}
        initialState={{
          columns: {
            columnVisibilityModel: {
              id: false,
              phenotype: false,
              source: false,
              isolation_name: false,
              mutagen: false,
              note: false,
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