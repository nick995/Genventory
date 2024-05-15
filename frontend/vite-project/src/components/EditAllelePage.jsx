import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, Typography, Box, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axiosInstance from '../axios';


function EditAllelePage() {
    const theme = useTheme();
    const { id } = useParams();
    const navigate = useNavigate();
    const [allele, setAllele] = useState({
        name: '',
        source: '',
        isolation_name: '',
        mutagen: '',
        phenotype: '',
        qualifiers: '',
        gene: '',
        chrome: '',
        note: '',
        dnaSequence: '',
        date: ''
    });

    useEffect(() => {
        const fetchAlleles = async () => {
            try {
                const response = await axiosInstance.get(`model/alleles/${id}`);
                setAllele(response.data);
            } catch (error) {
                console.error("Fetch error: ", error);
            }
        };

        fetchAlleles();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAllele(prevAllele => ({
            ...prevAllele,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            const response = await axiosInstance.put(`model/alleles/${id}`, allele);
            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            alert('Allele updated successfully.');
            navigate('/model/alleles');
        } catch (error) {
            console.error('Failed to update allele', error);
            alert('Failed to update allele.');
        }
    };

    const navigateToAllele = (direction) => {
        const newId = direction === 'next' ? parseInt(id) + 1 : parseInt(id) - 1;
        navigate(`/model/alleles/edit/${newId}`);
    };

    return (
        <Box sx={{ mt: 1, px: 3, py: 2 }}>
            <Typography style={{ color: theme.palette.text.primary }} variant="h4" gutterBottom>Edit Allele</Typography>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <TextField name="gene" label="Gene" value={allele.gene} onChange={handleChange} fullWidth />
                </Grid>

                <Grid item xs={4}>
                    <TextField name="name" label="Name" value={allele.name} onChange={handleChange} fullWidth />
                </Grid>

                <Grid item xs={4}>
                    <TextField name="chrome" label="Chromosome" value={allele.chrome} onChange={handleChange} fullWidth />
                </Grid>

                <Grid item xs={9}>
                    <TextField name="qualifiers" label="Qualifiers" value={allele.qualifiers} onChange={handleChange} fullWidth />
                </Grid>

                <Grid item xs={9}>
                    <TextField name="phenotype" label="Phenotype" value={allele.phenotype} onChange={handleChange} fullWidth />
                </Grid>

                <Grid item xs={9}>
                    <TextField name="notes" label="Notes" multiline rows={4} value={allele.notes} onChange={handleChange} fullWidth />
                </Grid>

                <Grid item xs={5}>
                    <TextField name="source" label="Source" value={allele.source} onChange={handleChange} fullWidth />
                </Grid>

                <Grid item xs={5}>
                    <TextField name="mutagen" label="Mutagen" value={allele.mutagen} onChange={handleChange} fullWidth />
                </Grid>

                <Grid item xs={5}>
                    <TextField name="isolationName" label="Isolation Name" value={allele.isolation_name} onChange={handleChange} fullWidth />
                </Grid>

                <Grid item xs={9}>
                    <TextField name="dnaSequence" label="DNA Sequence" value={allele.dnaSequence} disabled onChange={handleChange} fullWidth />
                </Grid>


                <Grid item xs={12} sx={{ mt: 2 }}>
                    <Stack direction="row" justifyContent="space-between">
                        <Stack direction="row" spacing={1}>
                            <Button variant="outlined" onClick={() => navigate('/model/alleles/')} sx={{ flex: 1 }} >
                                Cancel
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleSave} sx={{ flex: 1 }} >
                                Save
                            </Button>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Button variant="text" onClick={() => navigateToAllele('previous')} >
                                Previous
                            </Button>
                            <Button variant="text" onClick={() => navigateToAllele('next')}>
                                Next
                            </Button>
                        </Stack>

                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
}

export default EditAllelePage;
