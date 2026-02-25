import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Container, Paper, TextField, Button, Typography, Box,
    Alert, CircularProgress, AppBar, Toolbar, IconButton, Tooltip
} from '@mui/material';
import { Home, LocalHospital } from '@mui/icons-material';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authAPI.login(formData);
            const { token, userId, name, email, role } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);
            localStorage.setItem('userName', name);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userRole', role);

            toast.success(`Welcome back, ${name}!`);

            if (role === 'PATIENT') {
                navigate('/patient/dashboard');
            } else if (role === 'DOCTOR') {
                navigate('/doctor/dashboard');
            } else if (role === 'ADMIN') {
                navigate('/admin/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed!');
            toast.error('Login failed!');
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
                        MediBook Pro - Login
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        🏥 Welcome Back
                    </Typography>
                    <Typography variant="body1" align="center" color="textSecondary" gutterBottom>
                        Login to your account
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email *"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Password *"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Login'}
                        </Button>
                    </form>

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography variant="body2">
                            Don't have an account? <Link to="/register">Register</Link>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;