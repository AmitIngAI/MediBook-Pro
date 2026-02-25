import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Container, Box, TextField, Button, Typography, Alert, Paper, Grid } from '@mui/material';

function RegisterDoctor() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullName: '',
        email: '',
        phone: '',
        specialization: '',
        experience: '',
        qualification: '',
        licenseNumber: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        try {
            const response = await api.post('/auth/register/doctor', {
                ...formData,
                experience: parseInt(formData.experience) || 0
            });
            
            setSuccess(response.data.message || 'Doctor registered successfully!');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Doctor Registration
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Specialization"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Experience (Years)"
                                    name="experience"
                                    type="number"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Qualification"
                                    name="qualification"
                                    value={formData.qualification}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="License Number"
                                    name="licenseNumber"
                                    value={formData.licenseNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Button type="submit" fullWidth variant="contained" size="large">
                                    Register as Doctor
                                </Button>
                            </Grid>
                        </Grid>
                    </form>

                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Typography variant="body2">
                            Already have account? <Link to="/login">Login</Link>
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Register as Patient? <Link to="/register">Click here</Link>
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}

export default RegisterDoctor;