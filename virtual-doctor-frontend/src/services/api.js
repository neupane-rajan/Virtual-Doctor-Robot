import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL
});

// Request interceptor for adding token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const login = (email, password) => api.post('/accounts/login/', { email, password });
export const register = (userData) => api.post('/accounts/register/', userData);
export const getProfile = () => api.get('/accounts/profile/');

// Symptom endpoints
export const getSymptoms = () => api.get('/symptoms/list/');
export const reportSymptoms = (data) => api.post('/symptoms/report/', data);
export const getSymptomHistory = () => api.get('/symptoms/history/');
export const getDiagnosis = (id) => api.get(`/symptoms/diagnosis/${id}/`);

// Chat endpoints
export const sendChatMessage = (message) => api.post('/symptoms/chat/', { message });

// Medication endpoints
export const getMedications = () => api.get('/medications/');
export const getMedication = (id) => api.get(`/medications/${id}/`); // Add this missing function
export const addMedication = (data) => api.post('/medications/', data);
export const updateMedication = (id, data) => api.put(`/medications/${id}/`, data);
export const deleteMedication = (id) => api.delete(`/medications/${id}/`);

// Appointment endpoints
export const getDoctors = () => api.get('/appointments/emergency-doctors/');
export const getAppointments = () => api.get('/appointments/');
export const scheduleAppointment = (data) => api.post('/appointments/', data);

export default api;