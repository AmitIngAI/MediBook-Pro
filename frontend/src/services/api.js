import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Auth APIs
export const authAPI = {
    login: (data) => api.post('/auth/login', data),
    registerPatient: (data) => api.post('/auth/register/patient', data),
    registerDoctor: (data) => api.post('/auth/register/doctor', data),
};

// Doctor APIs
export const doctorAPI = {
    getAll: () => api.get('/doctors'),  // Just /doctors, not /public/all
    getById: (id) => api.get(`/doctors/${id}`),
    getVerified: () => api.get('/doctors/verified'),
    getBySpecialization: (spec) => api.get(`/doctors/specialization/${spec}`),
};

// Appointment APIs
export const appointmentAPI = {
    book: (data) => api.post('/appointments/book', data),
    getPatientAppointments: (patientId) => api.get(`/appointments/patient/${patientId}`),
    getDoctorAppointments: (doctorId) => api.get(`/appointments/doctor/${doctorId}`),
    confirm: (id) => api.put(`/appointments/${id}/confirm`),
    cancel: (id) => api.put(`/appointments/${id}/cancel`),
};

export default api;