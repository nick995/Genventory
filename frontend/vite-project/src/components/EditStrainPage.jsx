import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, Typography, Box, Stack, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axiosInstance from '../axios';
import Autocomplete from "@mui/material/Autocomplete";

function EditStrainPage() {
    const theme = useTheme();
    const { id } = useParams();
    const navigate = useNavigate();
    const [alleles, setAlleles] = useState([]);
    const [strain, setStrain] = useState({
        name: '',
        position: '',
        date_entered: '',
        isolation_number: '',
        notes: '',
        alleles: [],
        source: '',
        lost_person: '',
        ordered_geno_type: '',
    });




    useEffect(() => {
        const fetchStrain = async () => {
            try {
                const response = await axiosInstance.get(`model/strains/${id}`);
                setStrain(response.data);
                // console.log(response.data);
                // console.log(strain);
            } catch (error) {
                console.error("Fetch error: ", error);
            }
        };

        const fetchAlleles = async () => {
            try {
                const response = await axiosInstance.get('model/alleles/');
                setAlleles(response.data);
            } catch (error) {
                console.error('Failed to fetch alleles', error);
            }
        };

        fetchStrain();
        fetchAlleles();
    }, [id]);


    const handleAlleleChange = (event, newValue) => {
        setStrain(prevState => ({
            ...prevState,
            alleles: newValue,  // Update the alleles array
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStrain(prevStrain => ({
            ...prevStrain,
            [name]: value
        }));
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
    const handleSave = async () => {
        try {
            const response = await axiosInstance.put(`model/strains/${id}`, {
                ...strain,
                alleles: strain.alleles ? strain.alleles.map(allele => allele.id) : [],
                ordered_geno_type: strain.alleles ? strain.alleles.map(allele => allele.gene_type).join(' ; ') + ' ;' : ''
            });
            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            alert('Strain updated successfully.');
            navigate('/model/strains');
        } catch (error) {
            console.error('Failed to update strain', error.response);
            alert('Failed to update strain.');
        }
    };

    const navigateToStrain = (direction) => {
        const newId = direction === 'next' ? parseInt(id) + 1 : parseInt(id) - 1;
        navigate(`/model/strains/edit/${newId}`);
    };

    const handleGeneClick = (geneTypeId) => {
        navigate(`/model/alleles/edit/${geneTypeId}`);
    };

    return (
        <Box sx={{ mt: 1, px: 3, py: 2 }}>
            <Typography style={{ color: theme.palette.text.primary }} variant="h4" gutterBottom>Edit Strain</Typography>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField name="name" label="Strain Name" value={strain.name} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={6}>
                    <TextField name="position" label="Position" value={strain.position} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={9}>
                    <Autocomplete
                        multiple
                        id="allele-tags"
                        options={alleles}
                        getOptionLabel={(option) => option.gene_type}
                        value={strain.alleles}
                        // isOptionEqualToValue={(option, value) => option.name === value.name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
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
                    <AllelesField
                        alleles={strain.alleles}
                        onAlleleClick={(alleleId) => handleGeneClick(alleleId)}
                    />
                </Grid>

                <Grid item xs={9}>
                    <TextField name="notes" label="Notes" multiline rows={4} value={strain.notes} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={4}>
                    <TextField name="source" label="Source" value={strain.source} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={4}>
                    <TextField name="date_entered" label="Date Collected" type="date" InputLabelProps={{ shrink: true }} value={strain.date_entered} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={4}>
                    <TextField name="isolation_number" label="Isolation Number" value={strain.isolation_number} onChange={handleChange} fullWidth />
                </Grid>


                <Grid item xs={12} sx={{ mt: 2 }}>
                    <Stack direction="row" justifyContent="space-between">
                        <Stack direction="row" spacing={1}>
                            <Button variant="outlined" onClick={() => navigate('/model/strains/')} sx={{ flex: 1 }} >
                                Cancel
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleSave} sx={{ flex: 1 }} >
                                Save
                            </Button>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Button variant="text" onClick={() => navigateToStrain('previous')} >
                                Previous
                            </Button>
                            <Button variant="text" onClick={() => navigateToStrain('next')}>
                                Next
                            </Button>
                        </Stack>

                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
}

export default EditStrainPage;
