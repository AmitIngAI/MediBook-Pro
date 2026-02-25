import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Container, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Alert } from '@mui/material';

function ViewPrescriptions() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    const fetchPrescriptions = async () => {
        try {
            const response = await api.get('/prescriptions/patient/1');
            setPrescriptions(response.data);
        } catch (err) {
            setError('Failed to load prescriptions');
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h4" sx={{ mb: 3 }}>My Prescriptions</Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    {prescriptions.length === 0 ? (
                        <Typography>No prescriptions found</Typography>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Doctor</TableCell>
                                        <TableCell>Diagnosis</TableCell>
                                        <TableCell>Medicines</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {prescriptions.map((prescription) => (
                                        <TableRow key={prescription.id}>
                                            <TableCell>
                                                {new Date(prescription.uploadDate).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                {prescription.appointment?.doctor?.user?.fullName || 'N/A'}
                                            </TableCell>
                                            <TableCell>{prescription.diagnosis}</TableCell>
                                            <TableCell>{prescription.medicines}</TableCell>
                                            <TableCell>
                                                <Button size="small" variant="outlined">
                                                    Download
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    <Button sx={{ mt: 3 }} onClick={() => navigate('/patient/dashboard')}>
                        Back to Dashboard
                    </Button>
                </Paper>
            </Box>
        </Container>
    );
}

export default ViewPrescriptions;