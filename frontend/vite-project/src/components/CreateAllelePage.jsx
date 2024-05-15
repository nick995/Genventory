import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, Box, Button, TextField, Typography, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axiosInstance from '../axios'
const CreateAllelePage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    // State to hold form input values
    const [alleleData, setAlleleData] = useState({
        name: '',
        source: '',
        isolation_name: '',
        mutagen: '',
        phenotype: '',
        qualifiers: '',
        gene: '',
        chrome: '',
        notes: ''

    });
    //date: '', 
    //dnaSequence: ''


    // update form state on input change
    const handleChange = (event) => {
        const { name, value } = event.target;
        setAlleleData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    // submit form data to create a new allele
    // const handleSubmit = async (event) => {
    //     event.preventDefault();

    //     try {
    //         const response = await fetch('http://localhost:8000/model/alleles/', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify([alleleData]),
    //         });
    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status}`);
    //         }
    //         const data = await response.json();
    //         alert('Allele created successfully.');
    //         navigate('/model/alleles');
    //     } catch (error) {
    //         console.error('Failed to create allele', error);
    //         alert('Failed to create allele.');
    //     }
    // };

    const handleSubmit = (e) => {
        console.log(alleleData)
        e.preventDefault();
        axiosInstance
            .post(`model/alleles/`, [alleleData])
            .then((res) => {
                alert('Allele created successfully.');
                navigate('/model/alleles'); // Make sure navigate is properly imported
            })
            .catch((error) => {
                console.error('Failed to create allele', error);
                alert('Failed to create allele.');
            });
    };

    return (

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, px: 3, py: 2 }}>
            <Typography style={{ color: theme.palette.text.primary }} variant="h4" gutterBottom>Create New Allele  </Typography>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <TextField
                        required
                        id="gene"
                        name="gene"
                        label="Gene"
                        type="text"
                        fullWidth
                        onChange={handleChange}
                        value={alleleData.gene}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        required
                        id="alleleName"
                        name="name"
                        label="Allele Name"
                        type="text"
                        fullWidth
                        onChange={handleChange}
                        value={alleleData.name}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        required
                        id="chrome"
                        name="chrome"
                        label="Chromosome"
                        type="text"
                        fullWidth
                        onChange={handleChange}
                        value={alleleData.chrome}
                    />
                </Grid>

                <Grid item xs={9}>
                    <TextField
                        id="qualifiers"
                        name="qualifiers"
                        label="Qualifiers"
                        type="text"
                        fullWidth
                        onChange={handleChange}
                        value={alleleData.qualifiers}
                    />
                </Grid>

                <Grid item xs={9}>
                    <TextField
                        id="phenotype"
                        name="phenotype"
                        label="Phenotype"
                        type="text"
                        fullWidth
                        onChange={handleChange}
                        value={alleleData.phenotype}
                    />
                </Grid>

                <Grid item xs={9}>

                    <TextField
                        id="notes"
                        name="note"
                        label="Notes"
                        multiline
                        rows={4}
                        fullWidth
                        onChange={handleChange}
                        value={alleleData.note}
                    />
                </Grid>

                <Grid item xs={5}>
                    <TextField
                        required
                        id="source"
                        name="source"
                        label="Source"
                        type="text"
                        fullWidth
                        onChange={handleChange}
                        value={alleleData.source}
                    />
                </Grid>

                <Grid item xs={5}>
                    <TextField
                        id="mutagen"
                        name="mutagen"
                        label="Mutagen"
                        type="text"
                        fullWidth
                        onChange={handleChange}
                        value={alleleData.mutagen}
                    />
                </Grid>

                <Grid item xs={5}>
                    <TextField
                        id="isolationName"
                        name="isolation_name"
                        label="Isolation Name"
                        type="text"
                        fullWidth
                        onChange={handleChange}
                        value={alleleData.isolation_name}
                    />
                </Grid>

                <Grid item xs={9}>
                    <TextField
                        id="dnaSequence"
                        disabled
                        name="dnaSequence"
                        label="DNA Sequence"
                        type="text"
                        fullWidth
                        onChange={handleChange}
                        value={""}
                    />
                </Grid>
            </Grid>
            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button
                    onClick={() => navigate(-1)}
                    variant="outlined"
                    sx={{ mt: 1, mb: 2 }}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Submit
                </Button>
            </Stack>
        </Box>
    );
};

export default CreateAllelePage;
