import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, Button, Grid, Card, CardContent,
    AppBar, Toolbar, Avatar, IconButton, Divider, Chip, Paper
} from '@mui/material';
import {
    LocalHospital, CalendarMonth, Person, VerifiedUser,
    AccessTime, Phone, Email, LocationOn, CheckCircle,
    Star, ArrowForward, Login, PersonAdd, Group,
    MedicalServices, Schedule, Assignment
} from '@mui/icons-material';

const LandingPage = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <CalendarMonth sx={{ fontSize: 40, color: '#1976d2' }} />,
            title: 'Easy Booking',
            description: 'Book appointments with doctors in just a few clicks'
        },
        {
            icon: <VerifiedUser sx={{ fontSize: 40, color: '#4caf50' }} />,
            title: 'Verified Doctors',
            description: 'All doctors are verified by our admin team'
        },
        {
            icon: <AccessTime sx={{ fontSize: 40, color: '#ff9800' }} />,
            title: '24/7 Available',
            description: 'Book appointments anytime, anywhere'
        },
        {
            icon: <Assignment sx={{ fontSize: 40, color: '#9c27b0' }} />,
            title: 'Digital Prescriptions',
            description: 'Get and store prescriptions digitally'
        }
    ];

    const stats = [
        { number: '500+', label: 'Doctors' },
        { number: '10,000+', label: 'Patients' },
        { number: '50,000+', label: 'Appointments' },
        { number: '4.8/5', label: 'Rating' }
    ];

    const specialties = [
        'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics',
        'Orthopedics', 'Psychiatry', 'General Medicine', 'ENT'
    ];

    const testimonials = [
        {
            name: 'Rajesh Kumar',
            role: 'Patient',
            rating: 5,
            comment: 'Excellent platform! Booking appointments has never been easier. The doctors are professional and the service is top-notch.'
        },
        {
            name: 'Dr. Priya Sharma',
            role: 'Cardiologist',
            rating: 5,
            comment: 'As a doctor, this platform helps me manage my appointments efficiently. The interface is intuitive and professional.'
        },
        {
            name: 'Amit Singh',
            role: 'Patient',
            rating: 5,
            comment: 'I love how I can see all available doctors and their specializations. The prescription feature is very helpful!'
        }
    ];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
            {/* Navbar */}
            <AppBar position="fixed" sx={{ bgcolor: 'white', boxShadow: 2 }}>
                <Toolbar>
                    <LocalHospital sx={{ mr: 2, color: '#1976d2' }} />
                    <Typography variant="h6" sx={{ flexGrow: 1, color: '#333', fontWeight: 'bold' }}>
                        MediBook Pro
                    </Typography>
                    <Button 
                        variant="outlined" 
                        onClick={() => navigate('/login')}
                        sx={{ mr: 2 }}
                        startIcon={<Login />}
                    >
                        Login
                    </Button>
                    <Button 
                        variant="contained" 
                        onClick={() => navigate('/register')}
                        startIcon={<PersonAdd />}
                    >
                        Register
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Hero Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    pt: 15,
                    pb: 10,
                    mt: 8
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography variant="h2" fontWeight="bold" gutterBottom>
                                Your Health, Our Priority
                            </Typography>
                            <Typography variant="h5" sx={{ mb: 4, opacity: 0.95 }}>
                                Book appointments with top doctors in your city. 
                                Anytime, Anywhere!
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => navigate('/register')}
                                    sx={{
                                        bgcolor: 'white',
                                        color: '#667eea',
                                        px: 4,
                                        py: 1.5,
                                        '&:hover': { bgcolor: '#f5f5f5' }
                                    }}
                                    startIcon={<PersonAdd />}
                                >
                                    Get Started
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={() => navigate('/login')}
                                    sx={{
                                        borderColor: 'white',
                                        color: 'white',
                                        px: 4,
                                        py: 1.5,
                                        '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                                    }}
                                    startIcon={<Login />}
                                >
                                    Sign In
                                </Button>
                            </Box>

                            {/* Quick Stats */}
                            <Grid container spacing={3} sx={{ mt: 4 }}>
                                {stats.map((stat, index) => (
                                    <Grid item xs={6} sm={3} key={index}>
                                        <Typography variant="h4" fontWeight="bold">
                                            {stat.number}
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            {stat.label}
                                        </Typography>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box sx={{ position: 'relative', textAlign: 'center' }}>
                                <img 
                                    src="https://img.freepik.com/free-vector/doctor-character-background_1270-84.jpg" 
                                    alt="Doctor"
                                    style={{ width: '100%', maxWidth: '500px', borderRadius: '20px' }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Typography variant="h3" align="center" fontWeight="bold" gutterBottom>
                    Why Choose MediBook Pro?
                </Typography>
                <Typography variant="h6" align="center" color="textSecondary" sx={{ mb: 6 }}>
                    Experience healthcare booking like never before
                </Typography>

                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card sx={{ height: '100%', textAlign: 'center', p: 3, border: '1px solid #e0e0e0' }}>
                                <Box sx={{ mb: 2 }}>
                                    {feature.icon}
                                </Box>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    {feature.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {feature.description}
                                </Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* How It Works */}
            <Box sx={{ bgcolor: '#f8f9fa', py: 8 }}>
                <Container maxWidth="lg">
                    <Typography variant="h3" align="center" fontWeight="bold" gutterBottom>
                        How It Works
                    </Typography>
                    <Typography variant="h6" align="center" color="textSecondary" sx={{ mb: 6 }}>
                        Book your appointment in 3 simple steps
                    </Typography>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Avatar sx={{ width: 80, height: 80, bgcolor: '#1976d2', mx: 'auto', mb: 2 }}>
                                    <Typography variant="h4">1</Typography>
                                </Avatar>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Register & Login
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Create your account as a patient or doctor in seconds
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Avatar sx={{ width: 80, height: 80, bgcolor: '#4caf50', mx: 'auto', mb: 2 }}>
                                    <Typography variant="h4">2</Typography>
                                </Avatar>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Find & Select Doctor
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Browse through our verified doctors and select by specialty
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Avatar sx={{ width: 80, height: 80, bgcolor: '#ff9800', mx: 'auto', mb: 2 }}>
                                    <Typography variant="h4">3</Typography>
                                </Avatar>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Book Appointment
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Choose date and time, confirm your appointment instantly
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Specialties Section */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Typography variant="h3" align="center" fontWeight="bold" gutterBottom>
                    Medical Specialties
                </Typography>
                <Typography variant="h6" align="center" color="textSecondary" sx={{ mb: 6 }}>
                    Find specialists for all your healthcare needs
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
                    {specialties.map((specialty, index) => (
                        <Chip
                            key={index}
                            label={specialty}
                            size="large"
                            sx={{
                                fontSize: '1rem',
                                py: 3,
                                px: 2,
                                bgcolor: index % 2 === 0 ? '#e3f2fd' : '#f3e5f5',
                                '&:hover': { transform: 'scale(1.05)' },
                                transition: 'transform 0.3s'
                            }}
                            icon={<MedicalServices />}
                        />
                    ))}
                </Box>
            </Container>

            {/* Testimonials */}
            <Box sx={{ bgcolor: '#f8f9fa', py: 8 }}>
                <Container maxWidth="lg">
                    <Typography variant="h3" align="center" fontWeight="bold" gutterBottom>
                        What Our Users Say
                    </Typography>
                    <Typography variant="h6" align="center" color="textSecondary" sx={{ mb: 6 }}>
                        Real experiences from real people
                    </Typography>

                    <Grid container spacing={4}>
                        {testimonials.map((testimonial, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Card sx={{ p: 3, height: '100%' }}>
                                    <Box sx={{ display: 'flex', mb: 2 }}>
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} sx={{ color: '#ffc107' }} />
                                        ))}
                                    </Box>
                                    <Typography variant="body1" paragraph>
                                        "{testimonial.comment}"
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                        <Avatar sx={{ mr: 2 }}>
                                            <Person />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                {testimonial.name}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                {testimonial.role}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* CTA Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    py: 8
                }}
            >
                <Container maxWidth="md">
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" fontWeight="bold" gutterBottom>
                            Ready to Get Started?
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 4, opacity: 0.95 }}>
                            Join thousands of patients and doctors who trust MediBook Pro
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => navigate('/register')}
                                sx={{
                                    bgcolor: 'white',
                                    color: '#667eea',
                                    px: 4,
                                    py: 1.5,
                                    '&:hover': { bgcolor: '#f5f5f5' }
                                }}
                                endIcon={<ArrowForward />}
                            >
                                Register Now
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => navigate('/login')}
                                sx={{
                                    borderColor: 'white',
                                    color: 'white',
                                    px: 4,
                                    py: 1.5,
                                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                                }}
                            >
                                Login
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Footer */}
            <Box sx={{ bgcolor: '#2c3e50', color: 'white', py: 6 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <LocalHospital sx={{ mr: 1 }} />
                                <Typography variant="h6" fontWeight="bold">
                                    MediBook Pro
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                Your trusted partner for healthcare appointments. 
                                Book with confidence, consult with ease.
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Quick Links
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Button color="inherit" size="small" onClick={() => navigate('/login')}>
                                    Patient Login
                                </Button>
                                <Button color="inherit" size="small" onClick={() => navigate('/login')}>
                                    Doctor Login
                                </Button>
                                <Button color="inherit" size="small" onClick={() => navigate('/register')}>
                                    Register
                                </Button>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Contact Us
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Email sx={{ mr: 1, fontSize: 20 }} />
                                <Typography variant="body2">info@medibookpro.com</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Phone sx={{ mr: 1, fontSize: 20 }} />
                                <Typography variant="body2">+91 98765 43210</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LocationOn sx={{ mr: 1, fontSize: 20 }} />
                                <Typography variant="body2">Mumbai, India</Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 4, bgcolor: 'rgba(255,255,255,0.2)' }} />

                    <Typography variant="body2" align="center" sx={{ opacity: 0.8 }}>
                        © 2026-2030 MediBook Pro. All rights reserved. Made with ❤️ in India
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default LandingPage;