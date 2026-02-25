import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Container, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, Alert } from '@mui/material';

function ManageDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await api.get('/doctors');
            setDoctors(response.data);
        } catch (err) {
            setError('Failed to load doctors');
        }
    };

    const handleVerify = async (id) => {
        try {
            await api.put('/doctors/' + id + '/verify');
            setSuccess('Doctor verified successfully!');
            fetchDoctors();
        } catch (err) {
            setError('Failed to verify doctor');
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4 }}>
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h4" sx={{ mb: 3 }}>Manage Doctors</Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Specialization</TableCell>
                                    <TableCell>Experience</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {doctors.map((doctor) => (
                                    <TableRow key={doctor.id}>
                                        <TableCell>{doctor.user?.fullName || 'N/A'}</TableCell>
                                        <TableCell>{doctor.specialization}</TableCell>
                                        <TableCell>{doctor.experience} years</TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={doctor.isVerified ? 'Verified' : 'Pending'} 
                                                color={doctor.isVerified ? 'success' : 'warning'} 
                                                size="small" 
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {!doctor.isVerified && (
                                                <Button 
                                                    size="small" 
                                                    variant="contained" 
                                                    color="success"
                                                    onClick={() => handleVerify(doctor.id)}
                                                >
                                                    Verify
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Button sx={{ mt: 3 }} onClick={() => navigate('/admin/dashboard')}>
                        Back to Dashboard
                    </Button>
                </Paper>
            </Box>
        </Container>
    );
}

export default ManageDoctors;