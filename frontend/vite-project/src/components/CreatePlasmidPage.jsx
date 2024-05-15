import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, Box, Button, TextField, Typography, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axiosInstance from '../axios'
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';

const CreatePlasmidPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [plasmidData, setPlasmidData] = useState({
        name: '',
        position: '',
        create_at: '',
        constructed_by: '',
        drug_resistance: '',
        vector: '',
        reference: '',
        short_description: '',
        summary_of_construction: '',
        sequence:'',
        dna_type:'',
        MTA:''
    });
    const [fileContent, setFileContent]=useState(plasmidData.sequence);

    
    const handleChange = (event) => {
        const { name, value } = event.target;
        setPlasmidData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        console.log(plasmidData)
        e.preventDefault();
        axiosInstance
            .post(`model/plasmids/`, [plasmidData])
            .then((res) => {
                alert('Plasmid created successfully.');
                navigate('/model/plasmids'); // Make sure navigate is properly imported
            })
            .catch((error) => {
                console.error('Failed to create plasmid', error);
                alert('Failed to create plasmid.');
            });
    };
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
    
        reader.onload = (e) => {
          setFileContent(e.target.result);
          plasmidData.sequence=e.target.result;
        };
    
        reader.readAsText(file);
      };

    const downloadTxtFile = () => {
        const texts = [plasmidData.sequence] //content

        const file = new Blob(texts, {type: 'text/plain'});
        const element = document.createElement("a");
        element.href = URL.createObjectURL(file);
        element.download = plasmidData.name+".gb";
    
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, px: 3, py: 2 }}>
            <Typography style={{ color: theme.palette.text.primary }} variant="h4" gutterBottom>Create New Plasmid</Typography>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <TextField
                        required
                        fullWidth
                        id="plasmid-name"
                        label="Plasmid Name"
                        name="name"
                        autoFocus
                        value={plasmidData.name}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        fullWidth
                        id="MTA"
                        label="MTA"
                        name="MTA"
                        value={plasmidData.MTA}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        required
                        fullWidth
                        id="position"
                        label="Position"
                        name="position"
                        type="number"
                        value={plasmidData.position}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        fullWidth
                        id="drug-resistance"
                        label="Drug Resistance"
                        name="drug_resistance"
                        value={plasmidData.drug_resistance}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        fullWidth
                        id="vector"
                        label="Vector"
                        name="vector"
                        value={plasmidData.vector}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        fullWidth
                        id="short-description"
                        label="Short Description"
                        name="short_description"
                        multiline
                        rows={2}
                        value={plasmidData.short_description}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        fullWidth
                        id="dna_type"
                        label="DNA type"
                        name="dna_type"
                        value={plasmidData.dna_type}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        id="constructed-by"
                        label="Source"
                        name="constructed_by"
                        value={plasmidData.constructed_by}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        required
                        fullWidth
                        id="create-at"
                        label="Date"
                        name="create_at"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={plasmidData.create_at}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item xs={9}>
                    <TextField
                        fullWidth
                        id="reference"
                        label="Reference"
                        name="reference"
                        value={plasmidData.reference}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item xs={9}>
                    <TextField
                        fullWidth
                        id="summary-of-construction"
                        label="Summary of Construction"
                        name="summary_of_construction"
                        multiline
                        rows={4}
                        value={plasmidData.summary_of_construction}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={15}>
                    <Stack direction="row" justifyContent="space-between">
                    <TextField
                        fullWidth
                        id="sequence"
                        label="Sequence"
                        name="sequence"
                        multiline
                        rows={4}
                        value={plasmidData.sequence}
                        onChange={handleChange}
                    />
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

export default CreatePlasmidPage;
