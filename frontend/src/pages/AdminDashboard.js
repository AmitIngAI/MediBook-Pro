import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Grid, Paper, Typography, Box, Button, Card,
    CardContent, Chip, CircularProgress, Avatar, Divider,
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Tab, Tabs, Dialog, DialogTitle, DialogContent,
    DialogActions, AppBar, Toolbar, IconButton, Tooltip
} from '@mui/material';
import {
    AdminPanelSettings, Logout, Person, LocalHospital,
    CalendarMonth, CheckCircle, Cancel, Pending, VerifiedUser,
    Home, DarkMode, LightMode
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { DarkModeContext } from '../App';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [verifyDialog, setVerifyDialog] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDoctors: 0,
        totalPatients: 0,
        totalAppointments: 0,
        pendingDoctors: 0
    });

    const userName = localStorage.getItem('userName');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const doctorsRes = await fetch(`${process.env.REACT_APP_API_URL}/doctors');
            const doctorsData = await doctorsRes.json();
            setDoctors(doctorsData);

            const appointmentsRes = await fetch(`${process.env.REACT_APP_API_URL}/appointments/all');
            const appointmentsData = await appointmentsRes.json();
            setAppointments(appointmentsData);

            setStats({
                totalUsers: doctorsData.length,
                totalDoctors: doctorsData.length,
                totalPatients: 0,
                totalAppointments: appointmentsData.length,
                pendingDoctors: doctorsData.filter(d => !d.verified).length
            });
        } catch (error) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyDoctor = (doctor) => {
        setSelectedDoctor(doctor);
        setVerifyDialog(true);
    };

    const confirmVerifyDoctor = async () => {
        try {
            await fetch(`${process.env.REACT_APP_API_URL}/admin/doctors/${selectedDoctor.id}/verify`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });
            toast.success('Doctor verified successfully!');
            setVerifyDialog(false);
            fetchData();
        } catch (error) {
            toast.error('Failed to verify doctor');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
        toast.info('Logged out successfully');
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <>
            {/* Navbar */}
            <AppBar position="static">
                <Toolbar>
                    <Tooltip title="Go to Home">
                        <IconButton color="inherit" onClick={() => navigate('/')} sx={{ mr: 2 }}>
                            <Home />
                        </IconButton>
                    </Tooltip>

                    <AdminPanelSettings sx={{ mr: 1 }} />

                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Admin Dashboard
                    </Typography>

                    <Tooltip title={darkMode ? 'Light Mode' : 'Dark Mode'}>
                        <IconButton color="inherit" onClick={toggleDarkMode}>
                            {darkMode ? <LightMode /> : <DarkMode />}
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>

                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'error.main', mr: 2, width: 56, height: 56 }}>
                            <AdminPanelSettings fontSize="large" />
                        </Avatar>
                        <Box>
                            <Typography variant="h4">
                                Admin Dashboard
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                Welcome, {userName}!
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleLogout}
                        startIcon={<Logout />}
                    >
                        Logout
                    </Button>
                </Box>

                {/* Stats */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h4">{stats.totalDoctors}</Typography>
                                <Typography>Doctors</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h4">{stats.totalAppointments}</Typography>
                                <Typography>Appointments</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h4">{stats.pendingDoctors}</Typography>
                                <Typography>Pending</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h4">{stats.totalUsers}</Typography>
                                <Typography>Total Users</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Tabs */}
                <Paper sx={{ mb: 3 }}>
                    <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} centered>
                        <Tab label="Doctors" />
                        <Tab label="Appointments" />
                        <Tab label="Pending" />
                    </Tabs>
                </Paper>

                <Paper sx={{ p: 3 }}>
                    {tabValue === 0 && (
                        <>
                            <Typography variant="h6">All Doctors</Typography>
                            <Divider sx={{ mb: 2 }} />
                            {doctors.map((doctor) => (
                                <Box key={doctor.id} sx={{ mb: 2 }}>
                                    <Typography>
                                        Dr. {doctor.user?.name} — {doctor.specialization}
                                    </Typography>
                                    {!doctor.verified && (
                                        <Button
                                            size="small"
                                            variant="contained"
                                            color="success"
                                            onClick={() => handleVerifyDoctor(doctor)}
                                        >
                                            Verify
                                        </Button>
                                    )}
                                </Box>
                            ))}
                        </>
                    )}

                    {tabValue === 1 && (
                        <>
                            <Typography variant="h6">All Appointments</Typography>
                            <Divider sx={{ mb: 2 }} />
                            {appointments.map((apt) => (
                                <Box key={apt.id} sx={{ mb: 2 }}>
                                    <Typography>
                                        {apt.patient?.user?.name} with {apt.doctor?.user?.name}
                                    </Typography>
                                </Box>
                            ))}
                        </>
                    )}

                    {tabValue === 2 && (
                        <>
                            <Typography variant="h6">Pending Verification</Typography>
                            <Divider sx={{ mb: 2 }} />
                            {doctors.filter(d => !d.verified).map((doctor) => (
                                <Box key={doctor.id} sx={{ mb: 2 }}>
                                    <Typography>
                                        Dr. {doctor.user?.name}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => handleVerifyDoctor(doctor)}
                                    >
                                        Verify Doctor
                                    </Button>
                                </Box>
                            ))}
                        </>
                    )}
                </Paper>

                {/* Dialog */}
                <Dialog open={verifyDialog} onClose={() => setVerifyDialog(false)}>
                    <DialogTitle>Verify Doctor</DialogTitle>
                    <DialogContent>
                        Are you sure you want to verify Dr. {selectedDoctor?.user?.name}?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setVerifyDialog(false)}>Cancel</Button>
                        <Button variant="contained" color="success" onClick={confirmVerifyDoctor}>
                            Verify
                        </Button>
                    </DialogActions>
                </Dialog>

            </Container>
        </>
    );
};

export default AdminDashboard;
