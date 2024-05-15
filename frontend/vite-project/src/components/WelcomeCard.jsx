import React from 'react';
import { Card, CardContent, Typography, Grid, Container } from '@mui/material';


const WelcomeCard = ({ title, subtitle }) => {
    return (
        <Container maxWidth="lg" className="welcomeCardContainer">
            <Grid container spacing={3} justify="center" alignItems="center" >
                <Grid item xs={12} md={20} lg={24}>
                    <Card raised>
                        <CardContent>
                            <Typography variant="h2" component="h2" gutterBottom align="center">
                                Welcome to Genventory!
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary" align="center">
                                Streamlining genetic data with intuitive and secure database solutions for researchers.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default WelcomeCard;
