import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

class AuthService {
  async login(username, password) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('fullName', response.data.fullName);
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('role', response.data.role);
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
  
  logout() {
    localStorage.clear();
    delete axios.defaults.headers.common['Authorization'];
  }
  
  getCurrentUser() {
    return {
      userId: localStorage.getItem('userId'),
      username: localStorage.getItem('username'),
      fullName: localStorage.getItem('fullName'),
      email: localStorage.getItem('email'),
      role: localStorage.getItem('role'),
      token: localStorage.getItem('token')
    };
  }
  
  isLoggedIn() {
    return !!localStorage.getItem('token');
  }
}

export default new AuthService();