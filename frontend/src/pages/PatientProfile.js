import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Paper, TextField, Button, Typography, Box,
    Grid, FormControl, InputLabel, Select, MenuItem, Avatar,
    CircularProgress
} from '@mui/material';
import { Person, Save, ArrowBack } from '@mui/icons-material';
import { toast } from 'react-toastify';

const PatientProfile = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const [loading, setLoading] = useState(false);
    
    const [profile, setProfile] = useState({
        name: localStorage.getItem('userName') || '',
        email: localStorage.getItem('userEmail') || '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        bloodGroup: '',
        address: '',
        emergencyContact: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/patients/profile/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setProfile({
                    name: data.user?.name || '',
                    email: data.user?.email || '',
                    phone: data.user?.phone || '',
                    dateOfBirth: data.dateOfBirth || '',
                    gender: data.gender || '',
                    bloodGroup: data.bloodGroup || '',
                    address: data.address || '',
                    emergencyContact: data.emergencyContact || ''
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await fetch(`http://localhost:8080/api/patients/profile/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile)
            });
            
            if (response.ok) {
                toast.success('Profile updated successfully!');
                localStorage.setItem('userName', profile.name);
            } else {
                toast.error('Failed to update profile');
            }
        } catch (error) {
            toast.error('Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/patient/dashboard')}
                sx={{ mb: 2 }}
            >
                Back to Dashboard
            </Button>

            <Paper sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 56, height: 56 }}>
                        <Person fontSize="large" />
                    </Avatar>
                    <Typography variant="h4">My Profile</Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="name"
                                value={profile.name}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                value={profile.email}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                name="phone"
                                value={profile.phone}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Date of Birth"
                                name="dateOfBirth"
                                type="date"
                                value={profile.dateOfBirth}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Gender</InputLabel>
                                <Select
                                    name="gender"
                                    value={profile.gender}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="">Select</MenuItem>
                                    <MenuItem value="MALE">Male</MenuItem>
                                    <MenuItem value="FEMALE">Female</MenuItem>
                                    <MenuItem value="OTHER">Other</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Blood Group</InputLabel>
                                <Select
                                    name="bloodGroup"
                                    value={profile.bloodGroup}
                                    label="Blood Group"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="">Select</MenuItem>
                                    <MenuItem value="A+">A+</MenuItem>
                                    <MenuItem value="A-">A-</MenuItem>
                                    <MenuItem value="B+">B+</MenuItem>
                                    <MenuItem value="B-">B-</MenuItem>
                                    <MenuItem value="AB+">AB+</MenuItem>
                                    <MenuItem value="AB-">AB-</MenuItem>
                                    <MenuItem value="O+">O+</MenuItem>
                                    <MenuItem value="O-">O-</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Address"
                                name="address"
                                value={profile.address}
                                onChange={handleChange}
                                multiline
                                rows={2}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Emergency Contact Number"
                                name="emergencyContact"
                                value={profile.emergencyContact}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                startIcon={<Save />}
                                fullWidth
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Save Profile'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default PatientProfile;