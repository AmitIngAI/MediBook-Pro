import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Grid, Paper, Typography, Box, Button, Card,
    CardContent, CardActions, Chip, CircularProgress, Avatar,
    Divider, TextField, Dialog, DialogTitle, DialogContent,
    DialogActions, Tab, Tabs, AppBar, Toolbar, IconButton, Tooltip
} from '@mui/material';
import {
    CalendarMonth, Person, Logout, CheckCircle, Cancel,
    Pending, Schedule, LocalHospital, EventNote, MedicalServices,
    Home, DarkMode, LightMode
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { DarkModeContext } from '../App';

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const [prescriptionDialog, setPrescriptionDialog] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [prescription, setPrescription] = useState('');
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        confirmed: 0,
        completed: 0
    });

    const userName = localStorage.getItem('userName');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/appointments/doctor/user/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setAppointments(data);
                setStats({
                    total: data.length,
                    pending: data.filter(a => a.status === 'PENDING').length,
                    confirmed: data.filter(a => a.status === 'CONFIRMED').length,
                    completed: data.filter(a => a.status === 'COMPLETED').length
                });
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/appointments/${id}/confirm`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.ok) {
                toast.success('Appointment confirmed!');
                fetchAppointments();
            }
        } catch (error) {
            toast.error('Failed to confirm appointment');
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Cancel this appointment?')) return;
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/appointments/${id}/cancel`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.ok) {
                toast.success('Appointment cancelled!');
                fetchAppointments();
            }
        } catch (error) {
            toast.error('Failed to cancel appointment');
        }
    };

    const openPrescriptionDialog = (appointment) => {
        setSelectedAppointment(appointment);
        setPrescription('');
        setPrescriptionDialog(true);
    };

    const handleComplete = async () => {
        if (!prescription.trim()) {
            toast.error('Please enter prescription');
            return;
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/appointments/${selectedAppointment.id}/complete`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prescription: prescription })
            });
            if (response.ok) {
                toast.success('Appointment completed!');
                setPrescriptionDialog(false);
                fetchAppointments();
            }
        } catch (error) {
            toast.error('Failed to complete appointment');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
        toast.info('Logged out successfully');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'warning';
            case 'CONFIRMED': return 'info';
            case 'COMPLETED': return 'success';
            case 'CANCELLED': return 'error';
            default: return 'default';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PENDING': return <Pending />;
            case 'CONFIRMED': return <Schedule />;
            case 'COMPLETED': return <CheckCircle />;
            case 'CANCELLED': return <Cancel />;
            default: return <Pending />;
        }
    };

    const filterAppointments = () => {
        switch (tabValue) {
            case 0: return appointments;
            case 1: return appointments.filter(a => a.status === 'PENDING');
            case 2: return appointments.filter(a => a.status === 'CONFIRMED');
            case 3: return appointments.filter(a => a.status === 'COMPLETED');
            default: return appointments;
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

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
                        Doctor Dashboard
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
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 56, height: 56 }}>
                            <LocalHospital fontSize="large" />
                        </Avatar>
                        <Box>
                            <Typography variant="h4">Dr. {userName}</Typography>
                            <Typography variant="body1" color="textSecondary">Welcome back!</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant="outlined" onClick={() => navigate('/doctor/profile')} startIcon={<Person />}>
                            My Profile
                        </Button>
                        <Button variant="outlined" color="error" onClick={handleLogout} startIcon={<Logout />}>
                            Logout
                        </Button>
                    </Box>
                </Box>

                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={6} sm={3}>
                        <Card sx={{ bgcolor: '#e3f2fd', textAlign: 'center' }}>
                            <CardContent>
                                <Typography variant="h3">{stats.total}</Typography>
                                <Typography>Total</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Card sx={{ bgcolor: '#fff3e0', textAlign: 'center' }}>
                            <CardContent>
                                <Typography variant="h3">{stats.pending}</Typography>
                                <Typography>Pending</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Card sx={{ bgcolor: '#e0f7fa', textAlign: 'center' }}>
                            <CardContent>
                                <Typography variant="h3">{stats.confirmed}</Typography>
                                <Typography>Confirmed</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Card sx={{ bgcolor: '#e8f5e9', textAlign: 'center' }}>
                            <CardContent>
                                <Typography variant="h3">{stats.completed}</Typography>
                                <Typography>Completed</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Tabs */}
                <Paper sx={{ mb: 3 }}>
                    <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} centered>
                        <Tab label="All" icon={<EventNote />} />
                        <Tab label="Pending" icon={<Pending />} />
                        <Tab label="Confirmed" icon={<Schedule />} />
                        <Tab label="Completed" icon={<CheckCircle />} />
                    </Tabs>
                </Paper>

                {/* Appointments List */}
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>📅 Appointments</Typography>
                    <Divider sx={{ mb: 2 }} />

                    {filterAppointments().length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography color="textSecondary">No appointments found.</Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={2}>
                            {filterAppointments().map((apt) => (
                                <Grid item xs={12} md={6} key={apt.id}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                                                        <Person />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="h6">{apt.patient?.user?.name || 'Patient'}</Typography>
                                                        <Typography variant="body2" color="textSecondary">
                                                            {apt.patient?.user?.phone || apt.patient?.user?.email || ''}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Chip icon={getStatusIcon(apt.status)} label={apt.status} color={getStatusColor(apt.status)} size="small" />
                                            </Box>
                                            <Divider sx={{ my: 1 }} />
                                            <Typography variant="body2">📅 Date: {apt.appointmentDate || 'Not set'}</Typography>
                                            <Typography variant="body2">⏰ Time: {apt.appointmentTime || 'Not set'}</Typography>
                                            <Typography variant="body2">💰 Fee: ₹{apt.fee || 500}</Typography>
                                            {apt.reason && <Typography variant="body2" sx={{ mt: 1 }}>📝 Reason: {apt.reason}</Typography>}
                                            {apt.prescription && <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>💊 Prescription: {apt.prescription}</Typography>}
                                        </CardContent>
                                        <CardActions>
                                            {apt.status === 'PENDING' && (
                                                <>
                                                    <Button size="small" color="success" variant="contained" onClick={() => handleConfirm(apt.id)} startIcon={<CheckCircle />}>
                                                        Confirm
                                                    </Button>
                                                    <Button size="small" color="error" onClick={() => handleCancel(apt.id)}>Cancel</Button>
                                                </>
                                            )}
                                            {apt.status === 'CONFIRMED' && (
                                                <Button size="small" color="primary" variant="contained" onClick={() => openPrescriptionDialog(apt)} startIcon={<MedicalServices />}>
                                                    Complete & Add Prescription
                                                </Button>
                                            )}
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Paper>

                {/* Prescription Dialog */}
                <Dialog open={prescriptionDialog} onClose={() => setPrescriptionDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <MedicalServices sx={{ mr: 1 }} />
                            Add Prescription
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            Patient: {selectedAppointment?.patient?.user?.name}
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={6}
                            label="Prescription *"
                            value={prescription}
                            onChange={(e) => setPrescription(e.target.value)}
                            placeholder="Enter medicines, dosage, and instructions..."
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setPrescriptionDialog(false)}>Cancel</Button>
                        <Button variant="contained" onClick={handleComplete}>Complete Appointment</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default DoctorDashboard;