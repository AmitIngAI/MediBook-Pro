import React, { useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PatientProfile from './pages/PatientProfile';
import DoctorProfile from './pages/DoctorProfile';
import PaymentPage from './pages/PaymentPage';

// Create Dark Mode Context
export const DarkModeContext = createContext();

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        if (userRole === 'PATIENT') return <Navigate to="/patient/dashboard" replace />;
        if (userRole === 'DOCTOR') return <Navigate to="/doctor/dashboard" replace />;
        if (userRole === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
        return <Navigate to="/login" replace />;
    }

    return children;
};

function App() {
    const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('darkMode', newMode.toString());
    };

    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
            primary: { main: '#1976d2' },
            secondary: { main: '#dc004e' },
            background: {
                default: darkMode ? '#121212' : '#f5f5f5',
                paper: darkMode ? '#1e1e1e' : '#ffffff'
            }
        },
    });

    return (
        <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Router>
                    <Routes>
                        {/* Landing Page */}
                        <Route path="/" element={<LandingPage />} />

                        {/* Public Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Patient Routes */}
                        <Route
                            path="/patient/dashboard"
                            element={
                                <ProtectedRoute allowedRoles={['PATIENT']}>
                                    <PatientDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/book-appointment"
                            element={
                                <ProtectedRoute allowedRoles={['PATIENT']}>
                                    <BookAppointment />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/patient/appointments"
                            element={
                                <ProtectedRoute allowedRoles={['PATIENT']}>
                                    <MyAppointments />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/patient/profile"
                            element={
                                <ProtectedRoute allowedRoles={['PATIENT']}>
                                    <PatientProfile />
                                </ProtectedRoute>
                            }
                        />

                        {/* Doctor Routes */}
                        <Route
                            path="/doctor/dashboard"
                            element={
                                <ProtectedRoute allowedRoles={['DOCTOR']}>
                                    <DoctorDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/doctor/profile"
                            element={
                                <ProtectedRoute allowedRoles={['DOCTOR']}>
                                    <DoctorProfile />
                                </ProtectedRoute>
                            }
                        />

                        {/* Admin Routes */}
                        <Route
                            path="/admin/dashboard"
                            element={
                                <ProtectedRoute allowedRoles={['ADMIN']}>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />
                    
                        <Route
                           path="/payment"
                           element={
                               <ProtectedRoute allowedRoles={['PATIENT']}>
                                   <PaymentPage />
                               </ProtectedRoute>
                           }
                         />

                        {/* 404 */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Router>
                <ToastContainer position="top-right" autoClose={3000} theme={darkMode ? 'dark' : 'light'} />
            </ThemeProvider>
        </DarkModeContext.Provider>
    );
}

export default App;