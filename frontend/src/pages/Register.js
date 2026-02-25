import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Container, Paper, TextField, Button, Typography, Box,
    Alert, CircularProgress, FormControl, InputLabel, Select,
    MenuItem, Grid, AppBar, Toolbar, IconButton, Tooltip
} from '@mui/material';
import { Home, LocalHospital } from '@mui/icons-material';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

const Register = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('PATIENT');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        // Doctor fields
        specialization: '',
        qualification: '',
        experience: '',
        consultationFee: '',
        hospitalName: '',
        licenseNumber: ''
    });

    const specializations = [
        'General Medicine', 'Cardiology', 'Dermatology', 'Neurology',
        'Orthopedics', 'Pediatrics', 'Psychiatry', 'ENT', 'Ophthalmology',
        'Gynecology', 'Urology', 'Oncology', 'Gastroenterology'
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.password || !formData.phone) {
            setError('Please fill all required fields');
            return false;
        }

        if (role === 'DOCTOR') {
            if (!formData.specialization) {
                setError('Please select specialization');
                return false;
            }
            if (!formData.qualification) {
                setError('Please enter qualification');
                return false;
            }
            if (!formData.experience) {
                setError('Please enter experience');
                return false;
            }
            if (!formData.consultationFee) {
                setError('Please enter consultation fee');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setLoading(true);

        try {
            if (role === 'PATIENT') {
                await authAPI.registerPatient(formData);
            } else {
                await authAPI.registerDoctor(formData);
            }
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed!');
            toast.error('Registration failed!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            {/* Navbar with Home Button */}
            <AppBar position="static">
                <Toolbar>
                    <Tooltip title="Go to Home">
                        <IconButton color="inherit" onClick={() => navigate('/')} sx={{ mr: 2 }}>
                            <Home />
                        </IconButton>
                    </Tooltip>
                    <LocalHospital sx={{ mr: 1 }} />
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        MediBook Pro - Register
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        🏥 Create Account
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Register As *</InputLabel>
                        <Select
                            value={role}
                            label="Register As *"
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <MenuItem value="PATIENT">Patient</MenuItem>
                            <MenuItem value="DOCTOR">Doctor</MenuItem>
                        </Select>
                    </FormControl>

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            {/* Common Fields */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Full Name *"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Email *"
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
                                    label="Password *"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Phone Number *"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            {/* Doctor Specific Fields */}
                            {role === 'DOCTOR' && (
                                <>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" color="primary" sx={{ mt: 2 }}>
                                            Professional Details
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth required>
                                            <InputLabel>Specialization *</InputLabel>
                                            <Select
                                                name="specialization"
                                                value={formData.specialization}
                                                label="Specialization *"
                                                onChange={handleChange}
                                                required
                                            >
                                                {specializations.map(spec => (
                                                    <MenuItem key={spec} value={spec}>{spec}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Qualification *"
                                            name="qualification"
                                            value={formData.qualification}
                                            onChange={handleChange}
                                            placeholder="e.g., MBBS, MD, MS"
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Experience (Years) *"
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
                                            label="Consultation Fee (₹) *"
                                            name="consultationFee"
                                            type="number"
                                            value={formData.consultationFee}
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
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Hospital Name"
                                            name="hospitalName"
                                            value={formData.hospitalName}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                </>
                            )}
                        </Grid>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Register'}
                        </Button>
                    </form>

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography variant="body2">
                            Already have an account? <Link to="/login">Login</Link>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Register;