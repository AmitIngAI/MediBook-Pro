import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Grid, Paper, Typography, Box, Button, Card,
    CardContent, Chip, CircularProgress, Divider, AppBar, Toolbar,
    IconButton, Tooltip
} from '@mui/material';
import {
    CalendarMonth, Logout, Person, EventNote, Home, LocalHospital,
    DarkMode, LightMode
} from '@mui/icons-material';
import { appointmentAPI } from '../services/api';
import { toast } from 'react-toastify';
import { DarkModeContext } from '../App';

// Chart Imports
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip as ChartTooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    ChartTooltip,
    Legend,
    ArcElement
);

const PatientDashboard = () => {
    const navigate = useNavigate();
    const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0
    });

    const userName = localStorage.getItem('userName');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await appointmentAPI.getPatientAppointments(userId);
            const data = response.data;
            setAppointments(data);

            setStats({
                total: data.length,
                pending: data.filter(a => a.status === 'PENDING').length,
                confirmed: data.filter(a => a.status === 'CONFIRMED').length,
                completed: data.filter(a => a.status === 'COMPLETED').length,
                cancelled: data.filter(a => a.status === 'CANCELLED').length
            });
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
        toast.info('Logged out successfully');
    };

    const chartData = {
        labels: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
        datasets: [
            {
                label: 'Appointments',
                data: [stats.pending, stats.confirmed, stats.completed, stats.cancelled],
                backgroundColor: ['#FFA726', '#42A5F5', '#66BB6A', '#EF5350']
            }
        ]
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
                        Patient Dashboard
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            👋 Welcome, {userName}!
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/patient/profile')}
                            startIcon={<Person />}
                        >
                            My Profile
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/book-appointment')}
                            startIcon={<CalendarMonth />}
                        >
                            Book Appointment
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/patient/appointments')}
                            startIcon={<EventNote />}
                        >
                            My Appointments
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleLogout}
                            startIcon={<Logout />}
                        >
                            Logout
                        </Button>
                    </Box>
                </Box>

                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={6} sm={4} md={2.4}>
                        <Card sx={{ bgcolor: '#e3f2fd', textAlign: 'center' }}>
                            <CardContent>
                                <Typography variant="h4">{stats.total}</Typography>
                                <Typography variant="body2">Total</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2.4}>
                        <Card sx={{ bgcolor: '#fff3e0', textAlign: 'center' }}>
                            <CardContent>
                                <Typography variant="h4">{stats.pending}</Typography>
                                <Typography variant="body2">Pending</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2.4}>
                        <Card sx={{ bgcolor: '#e0f7fa', textAlign: 'center' }}>
                            <CardContent>
                                <Typography variant="h4">{stats.confirmed}</Typography>
                                <Typography variant="body2">Confirmed</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2.4}>
                        <Card sx={{ bgcolor: '#e8f5e9', textAlign: 'center' }}>
                            <CardContent>
                                <Typography variant="h4">{stats.completed}</Typography>
                                <Typography variant="body2">Completed</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2.4}>
                        <Card sx={{ bgcolor: '#ffebee', textAlign: 'center' }}>
                            <CardContent>
                                <Typography variant="h4">{stats.cancelled}</Typography>
                                <Typography variant="body2">Cancelled</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Charts Section */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>📊 Appointment Statistics</Typography>
                            <Bar data={chartData} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>🥧 Status Distribution</Typography>
                            <Pie data={chartData} />
                        </Paper>
                    </Grid>
                </Grid>

                {/* Recent Appointments */}
                <Paper sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">📅 Recent Appointments</Typography>
                        {appointments.length > 0 && (
                            <Button variant="text" onClick={() => navigate('/patient/appointments')} endIcon={<EventNote />}>
                                View All
                            </Button>
                        )}
                    </Box>
                    <Divider sx={{ mb: 2 }} />

                    {appointments.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography color="textSecondary" gutterBottom>No appointments yet.</Typography>
                            <Button variant="contained" onClick={() => navigate('/book-appointment')} startIcon={<CalendarMonth />}>
                                Book Your First Appointment
                            </Button>
                        </Box>
                    ) : (
                        <Grid container spacing={2}>
                            {appointments.slice(0, 4).map((apt) => (
                                <Grid item xs={12} md={6} key={apt.id}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="subtitle1" fontWeight="bold">
                                                    Dr. {apt.doctor?.user?.name || 'Unknown'}
                                                </Typography>
                                                <Chip
                                                    label={apt.status}
                                                    size="small"
                                                    color={
                                                        apt.status === 'COMPLETED' ? 'success' :
                                                        apt.status === 'CONFIRMED' ? 'info' :
                                                        apt.status === 'CANCELLED' ? 'error' : 'warning'
                                                    }
                                                />
                                            </Box>
                                            <Typography variant="body2" color="textSecondary">
                                                🏥 {apt.doctor?.specialization || 'General'}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                📅 {apt.appointmentDate} ⏰ {apt.appointmentTime}
                                            </Typography>
                                            <Typography variant="body2" color="primary">
                                                💰 ₹{apt.fee || 500}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Paper>
            </Container>
        </Box>
    );
};

export default PatientDashboard;