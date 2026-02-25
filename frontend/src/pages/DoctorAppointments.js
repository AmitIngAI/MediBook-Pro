import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Container, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, Alert } from '@mui/material';

function DoctorAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/appointments/doctor/1');
            setAppointments(response.data);
        } catch (err) {
            setError('Failed to load appointments');
        }
    };

    const handleConfirm = async (id) => {
        try {
            await api.put('/appointments/' + id + '/confirm');
            fetchAppointments();
        } catch (err) {
            setError('Failed to confirm');
        }
    };

    const handleComplete = async (id) => {
        try {
            await api.put('/appointments/' + id + '/complete');
            fetchAppointments();
        } catch (err) {
            setError('Failed to complete');
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4 }}>
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h4" sx={{ mb: 3 }}>My Appointments</Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Time</TableCell>
                                    <TableCell>Patient</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {appointments.map((apt) => (
                                    <TableRow key={apt.id}>
                                        <TableCell>{new Date(apt.appointmentDate).toLocaleDateString()}</TableCell>
                                        <TableCell>{apt.timeSlot}</TableCell>
                                        <TableCell>{apt.patient?.user?.fullName || 'N/A'}</TableCell>
                                        <TableCell>{apt.type}</TableCell>
                                        <TableCell>
                                            <Chip label={apt.status} size="small" />
                                        </TableCell>
                                        <TableCell>
    {apt.status === 'PENDING' && (
        <Button size="small" variant="contained" color="success" onClick={() => handleConfirm(apt.id)}>
            Confirm
        </Button>
    )}
    {apt.status === 'CONFIRMED' && (
        <>
            <Button size="small" variant="contained" onClick={() => handleComplete(apt.id)}>
                Complete
            </Button>
            <Button 
                size="small" 
                variant="outlined" 
                sx={{ ml: 1 }}
                onClick={() => navigate('/doctor/prescription/' + apt.id)}
            >
                Add Prescription
            </Button>
        </>
    )}
    {apt.status === 'COMPLETED' && (
        <Button 
            size="small" 
            variant="outlined"
            onClick={() => navigate('/doctor/prescription/' + apt.id)}
        >
            View/Edit Prescription
        </Button>
    )}
</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Button sx={{ mt: 3 }} onClick={() => navigate('/doctor/dashboard')}>Back</Button>
                </Paper>
            </Box>
        </Container>
    );
}

export default DoctorAppointments;