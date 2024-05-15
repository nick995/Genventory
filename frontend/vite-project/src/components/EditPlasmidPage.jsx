import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, Typography, Box, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axiosInstance from '../axios';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';


function EditPlasmidPage() {
    const theme = useTheme();
    const { id } = useParams();
    const navigate = useNavigate();
    const [plasmid, setPlasmid] = useState({
        position: '',
        name: '',
        create_at: '',
        constructed_by: '',
        drug_resistance: '',
        vector: '',
        MTA:'', //just added
        dna_type:'', //added
        reference: '',
        short_description: '',
        summary_of_construction: '',
        sequence:''
    });
    const [fileContent, setFileContent]=useState(plasmid.sequence);

    useEffect(() => {
        const fetchPlasmid = async () => {
            try {
                const response = await axiosInstance.get(`model/plasmids/${id}`);
                setPlasmid(response.data);
            } catch (error) {
                console.error("Fetch error: ", error);
            }
        };

        fetchPlasmid();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPlasmid(prevPlasmid => ({
            ...prevPlasmid,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            const response = await axiosInstance.put(`model/plasmids/${id}`, plasmid);
            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            alert('Plasmid updated successfully.');
            navigate('/model/plasmids');
        } catch (error) {
            console.error('Failed to update plasmid', error);
            alert('Failed to update plasmid.');
        }
    };

    const navigateToPlasmid = (direction) => {
        const newId = direction === 'next' ? parseInt(id) + 1 : parseInt(id) - 1;
        navigate(`/model/plasmids/edit/${newId}`);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
    
        reader.onload = (e) => {
          setFileContent(e.target.result);
          plasmid.sequence=e.target.result;
        };
    
        reader.readAsText(file);
      };

    const downloadTxtFile = () => {
        const texts = [plasmid.sequence] //content

        const file = new Blob(texts, {type: 'text/plain'});
        const element = document.createElement("a");
        element.href = URL.createObjectURL(file);
        element.download = plasmid.name+".gb";
    
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }
      

    return (
        <Box sx={{ mt: 1, px: 3, py: 2 }}>
            <Typography style={{ color: theme.palette.text.primary }} variant="h4" gutterBottom>Edit Plasmid</Typography>
            <Grid container spacing={2} >
                <Grid item xs={8}>
                    <TextField name="name" label="Plasmid Name" value={plasmid.name} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={4}>
                    <TextField name="MTA" label="MTA" value={plasmid.MTA} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={4}>
                    <TextField name="position" label="Position" value={plasmid.position} onChange={handleChange} fullWidth />
                </Grid>

                <Grid item xs={4}>
                    <TextField name="drug_resistance" label="Drug Resistance" value={plasmid.drug_resistance} onChange={handleChange} fullWidth />
                </Grid>

                <Grid item xs={4}>
                    <TextField name="vector" label="Vector" value={plasmid.vector} onChange={handleChange} fullWidth />
                </Grid>

                <Grid item xs={8}>
                    <TextField name="short_description" label="Short Description" multiline rows={4} value={plasmid.short_description} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={4}>
                    <TextField name="dna_type" label="DNA type" multiline rows={4} value={plasmid.dna_type} onChange={handleChange} fullWidth />
                </Grid>

                <Grid item xs={6}>
                    <TextField name="constructed_by" label="Constructed By" value={plasmid.constructed_by} onChange={handleChange} fullWidth />
                </Grid>

                <Grid item xs={6}>
                    <TextField name="create_at" label="Date" type="date" InputLabelProps={{ shrink: true }} value={plasmid.create_at} onChange={handleChange} fullWidth />
                </Grid>

                <Grid item xs={9}>
                    <TextField name="reference" label="Reference" value={plasmid.reference} onChange={handleChange} fullWidth />
                </Grid>

                <Grid item xs={9}>
                    <TextField name="summary_of_construction" label="Summary of Construction" multiline rows={4} value={plasmid.summary_of_construction} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={15}>
                    <Stack direction="row" justifyContent="space-between">

                    <TextField name="sequence" label="Sequence" multiline rows={4} value={plasmid.sequence} onChange={handleChange} fullWidth />
                
                    <Stack sx={{ mt: 2.5 }} direction="column" spacing={1}>
                        <Button  variant="contained" style={{height: '40px', width : '130px'}} startIcon={<UploadIcon />}>
                            <input type="file" onChange={handleFileUpload} accept=".txt, .gb" 
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                opacity: 0,
                                cursor: 'pointer',
                              }}/> 
                            upload 
                        </Button>
                        <Button variant="contained" style={{height: '40px', width : '130px'}}  onClick={downloadTxtFile} startIcon={<DownloadIcon />}>download</Button>
                        
                        </Stack>
                    </Stack>
                </Grid> 

                <Grid item xs={12} sx={{ mt: 2 }}>
                    <Stack direction="row" justifyContent="space-between">
                        <Stack direction="row" spacing={1}>
                            <Button variant="outlined" onClick={() => navigate('/model/plasmids/')} sx={{ flex: 1 }} >
                                Cancel
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleSave} sx={{ flex: 1 }} >
                                Save
                            </Button>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Button variant="text" onClick={() => navigateToPlasmid('previous')} >
                                Previous
                            </Button>
                            <Button variant="text" onClick={() => navigateToPlasmid('next')}>
                                Next
                            </Button>
                        </Stack>

                    </Stack>
                </Grid>

            </Grid>
        </Box>
    );
}

export default EditPlasmidPage;
