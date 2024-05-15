import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, Box, Button, TextField, Typography, Grid, Chip } from '@mui/material';
import Autocomplete from "@mui/material/Autocomplete";
import { useTheme } from '@mui/material/styles';
import axiosInstance from '../axios';

const CreateStrainPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [alleles, setAlleles] = useState([]);
    const [strainData, setStrainData] = useState({
        name: '',
        position: '',
        isolation_number: '',
        source: '',
        notes: '',
        genotype: [],
        date_entered: new Date().toISOString().split('T')[0],
        lost_person: '',
    });

    useEffect(() => {
        fetchAlleles();
    }, []);

    const fetchAlleles = async () => {
        try {
            const response = await axiosInstance.get('model/alleles/');
            setAlleles(response.data);
        } catch (error) {
            console.error('Failed to fetch alleles', error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setStrainData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAlleleChange = (event, newValue) => {
        const selectedAlleleGenotypes = newValue.map(allele => allele.gene_type);
        setStrainData(prevState => ({
            ...prevState,
            genotype: selectedAlleleGenotypes,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const requestBody = [strainData];

        console.log('Request Body:', requestBody);
        try {
            const response = await axiosInstance.post('model/strains/', requestBody);
            const responseData = response.data;
            console.log('Response Data:', responseData);

            alert('Strain created successfully.');
            navigate('/model/strains');
        } catch (error) {
            console.error('Failed to create strain', error);
            alert('Failed to create strain.');
        }
    };

    const AllelesField = ({ alleles, onAlleleClick }) => {
        return (
          <Box>
            <Typography variant="subtitle1" component="label">
              Genotype
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {alleles.map((allele, index) => (
                <Chip
                  key={index}
                  label={allele.gene_type}
                  onClick={() => onAlleleClick(allele.id)}
                  style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
                />
              ))}
            </Box>
          </Box>
        );
      };
    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, px: 3, py: 2 }}>
            <Typography style={{ color: theme.palette.text.primary }} variant="h4" gutterBottom>Create New Strain</Typography>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField
                        required
                        fullWidth
                        id="strain-name"
                        label="Strain Name"
                        name="name"
                        autoFocus
                        value={strainData.name}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        required
                        fullWidth
                        id="position"
                        label="Position"
                        name="position"
                        type="number"
                        value={strainData.position}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={9}>
                    <Autocomplete
                        multiple
                        id="allele-tags"
                        options={alleles}
                        getOptionLabel={(option) => option.gene_type}
                        onChange={handleAlleleChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="standard"
                                label="Alleles"
                                placeholder="Select alleles"
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={9}>
                    <TextField
                        fullWidth
                        id="genotype"
                        label="Genotype"
                        value={strainData.genotype.join(', ')}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Grid>
                <Grid item xs={9}>
                    <TextField
                        required
                        fullWidth
                        id="notes"
                        label="Notes"
                        multiline
                        rows={4}
                        name="notes"
                        value={strainData.notes}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        fullWidth
                        id="source"
                        label="Source"
                        name="source"
                        value={strainData.source}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        required
                        fullWidth
                        id="date_entered"
                        label="Date Collected"
                        name="date_entered"
                        type="date"
                        value={strainData.date_entered}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        required
                        fullWidth
                        id="isolation_number"
                        label="Isolation Number"
                        name="isolation_number"
                        value={strainData.isolation_number}
                        onChange={handleChange}
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

export default CreateStrainPage;
