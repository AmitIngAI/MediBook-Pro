import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Grid, Paper, Typography, Box, Button, Card,
    CardContent, CardActions, TextField, FormControl, InputLabel,
    Select, MenuItem, CircularProgress, Avatar, Chip, Alert
} from '@mui/material';
import { LocalHospital, ArrowBack, CalendarMonth } from '@mui/icons-material';
import { doctorAPI, appointmentAPI } from '../services/api';
import { toast } from 'react-toastify';

const BookAppointment = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [bookingStep, setBookingStep] = useState(1);
    const [bookingLoading, setBookingLoading] = useState(false);

    const [filters, setFilters] = useState({
        specialization: '',
        search: ''
    });

    const [advancedFilters, setAdvancedFilters] = useState({
        minFee: '',
        maxFee: '',
        experience: ''
    });

    const [bookingData, setBookingData] = useState({
        appointmentDate: '',
        appointmentTime: '',
        reason: '',
        notes: ''
    });

    const timeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
    ];

    const specializations = [
        'General Medicine', 'Cardiology', 'Dermatology', 'Neurology',
        'Orthopedics', 'Pediatrics', 'Psychiatry', 'ENT', 'Ophthalmology'
    ];

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await doctorAPI.getAll();
            setDoctors(response.data || []);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to load doctors');
            setDoctors([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectDoctor = (doctor) => {
        setSelectedDoctor(doctor);
        setBookingStep(2);
    };

    const handleBookingChange = (e) => {
        setBookingData({
            ...bookingData,
            [e.target.name]: e.target.value
        });
    };

    const handleConfirmBooking = async () => {
        if (!bookingData.appointmentDate || !bookingData.appointmentTime) {
            toast.error('Please select date and time');
            return;
        }

        setBookingLoading(true);

        try {
            const userId = localStorage.getItem('userId');

            await appointmentAPI.book({
                patientId: userId,
                doctorId: selectedDoctor.id,
                appointmentDate: bookingData.appointmentDate,
                appointmentTime: bookingData.appointmentTime,
                reason: bookingData.reason,
                notes: bookingData.notes
            });

            toast.success('Appointment booked successfully!');
            navigate('/patient/appointments');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to book appointment');
        } finally {
            setBookingLoading(false);
        }
    };

    const filteredDoctors = doctors.filter(doctor => {
        const matchesSpec = !filters.specialization || doctor.specialization === filters.specialization;
        const matchesSearch = !filters.search || doctor.user?.name?.toLowerCase().includes(filters.search.toLowerCase());
        const matchesMinFee = !advancedFilters.minFee || doctor.consultationFee >= Number(advancedFilters.minFee);
        const matchesMaxFee = !advancedFilters.maxFee || doctor.consultationFee <= Number(advancedFilters.maxFee);
        const matchesExperience = !advancedFilters.experience || doctor.experience >= Number(advancedFilters.experience);
        return matchesSpec && matchesSearch && matchesMinFee && matchesMaxFee && matchesExperience;
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => bookingStep === 1 ? navigate('/patient/dashboard') : setBookingStep(1)}
                    sx={{ mr: 2 }}
                >
                    Back
                </Button>
                <Typography variant="h4">
                    {bookingStep === 1 ? '👨‍⚕️ Select a Doctor' : '📅 Book Appointment'}
                </Typography>
            </Box>

            {/* STEP 1: Select Doctor */}
            {bookingStep === 1 && (
                <>
                    {/* Filters */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Search Doctor"
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    placeholder="Search by name..."
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Specialization</InputLabel>
                                    <Select
                                        value={filters.specialization}
                                        label="Specialization"
                                        onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
                                    >
                                        <MenuItem value="">All</MenuItem>
                                        {specializations.map(spec => (
                                            <MenuItem key={spec} value={spec}>{spec}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Min Fee"
                                    type="number"
                                    value={advancedFilters.minFee}
                                    onChange={(e) => setAdvancedFilters({ ...advancedFilters, minFee: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Max Fee"
                                    type="number"
                                    value={advancedFilters.maxFee}
                                    onChange={(e) => setAdvancedFilters({ ...advancedFilters, maxFee: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Min Experience (Years)"
                                    type="number"
                                    value={advancedFilters.experience}
                                    onChange={(e) => setAdvancedFilters({ ...advancedFilters, experience: e.target.value })}
                                />
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Doctors List */}
                    {filteredDoctors.length === 0 ? (
                        <Alert severity="info">No doctors found matching your criteria.</Alert>
                    ) : (
                        <Grid container spacing={3}>
                            {filteredDoctors.map((doctor) => (
                                <Grid item xs={12} sm={6} md={4} key={doctor.id}>
                                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 56, height: 56 }}>
                                                    <LocalHospital />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="h6">
                                                        Dr. {doctor.user?.name || 'Unknown'}
                                                    </Typography>
                                                    <Chip
                                                        label={doctor.specialization || 'General'}
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                    />
                                                </Box>
                                            </Box>
                                            <Typography variant="body2" color="textSecondary">
                                                🎓 {doctor.qualification || 'MBBS'}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                📅 {doctor.experience || 5} years experience
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                🏥 {doctor.hospitalName || 'Private Clinic'}
                                            </Typography>
                                            <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                                                ₹{doctor.consultationFee || 500}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                onClick={() => handleSelectDoctor(doctor)}
                                            >
                                                Book Appointment
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </>
            )}

            {/* STEP 2: Select Date & Time - THIS WAS MISSING! */}
            {bookingStep === 2 && selectedDoctor && (
                <Paper sx={{ p: 4 }}>
                    {/* Doctor Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 64, height: 64 }}>
                            <LocalHospital fontSize="large" />
                        </Avatar>
                        <Box>
                            <Typography variant="h5">Dr. {selectedDoctor.user?.name}</Typography>
                            <Typography color="textSecondary">{selectedDoctor.specialization || 'General'}</Typography>
                            <Typography variant="h6" color="primary">₹{selectedDoctor.consultationFee || 500}</Typography>
                        </Box>
                    </Box>

                    {/* Booking Form */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Select Date"
                                name="appointmentDate"
                                type="date"
                                value={bookingData.appointmentDate}
                                onChange={handleBookingChange}
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ min: minDate }}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Select Time</InputLabel>
                                <Select
                                    name="appointmentTime"
                                    value={bookingData.appointmentTime}
                                    label="Select Time"
                                    onChange={handleBookingChange}
                                >
                                    {timeSlots.map((slot) => (
                                        <MenuItem key={slot} value={slot}>{slot}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Reason for Visit"
                                name="reason"
                                value={bookingData.reason}
                                onChange={handleBookingChange}
                                multiline
                                rows={2}
                                placeholder="Describe your symptoms..."
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Additional Notes"
                                name="notes"
                                value={bookingData.notes}
                                onChange={handleBookingChange}
                                multiline
                                rows={2}
                                placeholder="Any additional information..."
                            />
                        </Grid>
                    </Grid>

                    {/* Buttons */}
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="outlined" onClick={() => setBookingStep(1)}>
                            Change Doctor
                        </Button>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<CalendarMonth />}
                            onClick={handleConfirmBooking}
                            disabled={bookingLoading || !bookingData.appointmentDate || !bookingData.appointmentTime}
                        >
                            {bookingLoading ? <CircularProgress size={24} /> : 'Confirm Booking'}
                        </Button>
                    </Box>
                </Paper>
            )}
        </Container>
    );
};

export default BookAppointment;