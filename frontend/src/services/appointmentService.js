import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:8080/api';

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

class AppointmentService {
  async bookAppointment(appointmentData) {
    try {
      const user = authService.getCurrentUser();
      const data = {
        ...appointmentData,
        patientId: parseInt(user.userId)
      };
      
      console.log('Booking with data:', data);
      
      const response = await axios.post(`${API_URL}/appointments/book`, data);
      return response.data;
    } catch (error) {
      console.error('Booking error:', error.response?.data || error);
      throw error;
    }
  }
  
  async getPatientAppointments(patientId) {
    const response = await axios.get(`${API_URL}/appointments/patient/${patientId}`);
    return response.data;
  }
  
  async getDoctorAppointments(doctorId) {
    const response = await axios.get(`${API_URL}/appointments/doctor/${doctorId}`);
    return response.data;
  }
  
  async cancelAppointment(appointmentId, reason = '') {
    const response = await axios.put(
      `${API_URL}/appointments/${appointmentId}/cancel`,
      { reason }
    );
    return response.data;
  }
  
  async confirmAppointment(appointmentId) {
    const response = await axios.put(`${API_URL}/appointments/${appointmentId}/confirm`);
    return response.data;
  }
  
  async completeAppointment(appointmentId) {
    const response = await axios.put(`${API_URL}/appointments/${appointmentId}/complete`);
    return response.data;
  }
}

export default new AppointmentService();