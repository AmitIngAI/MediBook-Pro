import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Paper, TextField, Button, Typography, Box,
    Grid, FormControl, InputLabel, Select, MenuItem, Avatar,
    CircularProgress
} from '@mui/material';
import { LocalHospital, Save, ArrowBack } from '@mui/icons-material';
import { toast } from 'react-toastify';

const DoctorProfile = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [profile, setProfile] = useState({
        name: localStorage.getItem('userName') || '',
        email: localStorage.getItem('userEmail') || '',
        phone: '',
        specialization: '',
        qualification: '',
        experience: '',
        consultationFee: '',
        hospitalName: '',
        hospitalAddress: '',
        about: '',
        licenseNumber: ''
    });

    const specializations = [
        'General Medicine', 'Cardiology', 'Dermatology', 'Neurology',
        'Orthopedics', 'Pediatrics', 'Psychiatry', 'ENT', 'Ophthalmology',
        'Gynecology', 'Urology', 'Oncology', 'Gastroenterology'
    ];

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/doctors/user/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setProfile({
                    name: data.user?.name || '',
                    email: data.user?.email || '',
                    phone: data.user?.phone || '',
                    specialization: data.specialization || '',
                    qualification: data.qualification || '',
                    experience: data.experience || '',
                    consultationFee: data.consultationFee || '',
                    hospitalName: data.hospitalName || '',
                    hospitalAddress: data.hospitalAddress || '',
                    about: data.about || '',
                    licenseNumber: data.licenseNumber || ''
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`http://localhost:8080/api/doctors/profile/${userId}`, {
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

    if (fetching) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/doctor/dashboard')}
                sx={{ mb: 2 }}
            >
                Back to Dashboard
            </Button>

            <Paper sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 56, height: 56 }}>
                        <LocalHospital fontSize="large" />
                    </Avatar>
                    <Typography variant="h4">Doctor Profile</Typography>
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
                            <FormControl fullWidth>
                                <InputLabel>Specialization</InputLabel>
                                <Select
                                    name="specialization"
                                    value={profile.specialization}
                                    label="Specialization"
                                    onChange={handleChange}
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
                                label="Qualification"
                                name="qualification"
                                value={profile.qualification}
                                onChange={handleChange}
                                placeholder="e.g., MBBS, MD, MS"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Experience (Years)"
                                name="experience"
                                type="number"
                                value={profile.experience}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Consultation Fee (₹)"
                                name="consultationFee"
                                type="number"
                                value={profile.consultationFee}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="License Number"
                                name="licenseNumber"
                                value={profile.licenseNumber}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Hospital Name"
                                name="hospitalName"
                                value={profile.hospitalName}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Hospital Address"
                                name="hospitalAddress"
                                value={profile.hospitalAddress}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="About Me"
                                name="about"
                                value={profile.about}
                                onChange={handleChange}
                                multiline
                                rows={3}
                                placeholder="Tell patients about yourself..."
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

export default DoctorProfile;