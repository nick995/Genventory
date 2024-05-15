import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

const fetchData = async () => {
    try {
        const response = await fetch('http://localhost:8000/api/location-plasmids/');
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

export default function LocationPlasmidsTable() {
    const [data, setData] = React.useState([]);
    const [columns, setColumns] = React.useState([]);

    React.useEffect(() => {
        fetchData().then(data => {
            setData(data.map((item, index) => ({ ...item, id: index })));
            if (data.length > 0) {
                const firstItem = data[0];
                const generatedColumns = Object.keys(firstItem).map(key => ({
                    field: key,
                    headerName: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '), 
                    width: 150,
                    editable: true,
                }));
                setColumns(generatedColumns);
            }
        });
    }, []);

    return (
        <div style={{ height: 400, width: '100%' }}>
            <Stack spacing={2} direction="row">
                <Button variant="contained">Create</Button>
                <Button variant="outlined">Export</Button>
            </Stack>
            <DataGrid
                rows={data} 
                columns={columns} 
                initialState={{
                    pagination: {
                        pageSize: 5, 
                    },
                }}
                pageSize={5}
                rowsPerPageOptions={[5, 10]}
                checkboxSelection
            />
        </div>
    );
}
