import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Container, Paper, Typography, Box, Button, Card,
    CardContent, Divider, CircularProgress
} from '@mui/material';
import { Payment, ArrowBack, CheckCircle } from '@mui/icons-material';
import { toast } from 'react-toastify';

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [paid, setPaid] = useState(false);

    const appointmentData = location.state || {
        doctorName: 'Unknown Doctor',
        date: 'N/A',
        time: 'N/A',
        fee: 500,
        appointmentId: null
    };

    const handlePayment = async () => {
        setLoading(true);

        try {
            // Create order
            const orderResponse = await fetch('http://localhost:8080/api/payments/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: appointmentData.fee * 100, // Razorpay uses paise
                    appointmentId: appointmentData.appointmentId
                })
            });

            const orderData = await orderResponse.json();

            // Simulate payment (In production, use Razorpay checkout)
            setTimeout(async () => {
                // Verify payment
                const verifyResponse = await fetch('http://localhost:8080/api/payments/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        paymentId: 'pay_' + Date.now(),
                        orderId: orderData.orderId
                    })
                });

                if (verifyResponse.ok) {
                    setPaid(true);
                    toast.success('Payment successful!');
                }

                setLoading(false);
            }, 2000);

        } catch (error) {
            toast.error('Payment failed');
            setLoading(false);
        }
    };

    if (paid) {
        return (
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                    <Typography variant="h4" gutterBottom>Payment Successful!</Typography>
                    <Typography color="textSecondary" paragraph>
                        Your appointment has been confirmed.
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/patient/appointments')}
                    >
                        View My Appointments
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
                sx={{ mb: 2 }}
            >
                Back
            </Button>

            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom align="center">
                    💳 Payment
                </Typography>

                <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6">Appointment Details</Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography>Doctor: Dr. {appointmentData.doctorName}</Typography>
                        <Typography>Date: {appointmentData.date}</Typography>
                        <Typography>Time: {appointmentData.time}</Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="h5" color="primary">
                            Amount: ₹{appointmentData.fee}
                        </Typography>
                    </CardContent>
                </Card>

                <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={<Payment />}
                    onClick={handlePayment}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : `Pay ₹${appointmentData.fee}`}
                </Button>

                <Typography variant="caption" display="block" align="center" sx={{ mt: 2 }}>
                    Secure payment powered by Razorpay
                </Typography>
            </Paper>
        </Container>
    );
};

export default PaymentPage;