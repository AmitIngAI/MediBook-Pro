import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { Container, Box, Typography, Paper, TextField, Button, Grid, Alert } from '@mui/material';

function AddPrescription() {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        medicines: '',
        instructions: '',
        diagnosis: ''
    });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        try {
            await api.post('/prescriptions/create', {
                appointmentId: appointmentId,
                ...formData
            });
            setSuccess('Prescription created successfully!');
            setTimeout(() => navigate('/doctor/appointments'), 2000);
        } catch (err) {
            setError('Failed to create prescription');
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h4" sx={{ mb: 3 }}>Add Prescription</Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Diagnosis"
                                    name="diagnosis"
                                    multiline
                                    rows={3}
                                    value={formData.diagnosis}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Medicines"
                                    name="medicines"
                                    multiline
                                    rows={4}
                                    placeholder="Medicine name, dosage, frequency..."
                                    value={formData.medicines}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Instructions"
                                    name="instructions"
                                    multiline
                                    rows={3}
                                    placeholder="Special instructions for patient..."
                                    value={formData.instructions}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" size="large" fullWidth>
                                    Create Prescription
                                </Button>
                            </Grid>
                        </Grid>
                    </form>

                    <Button sx={{ mt: 3 }} onClick={() => navigate('/doctor/appointments')}>
                        Back to Appointments
                    </Button>
                </Paper>
            </Box>
        </Container>
    );
}

export default AddPrescription;