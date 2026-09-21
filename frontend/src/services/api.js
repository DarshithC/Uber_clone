import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const register = (userData) => api.post('/auth/register', userData);
export const login = (credentials) => api.post('/auth/login', credentials);
export const getProfile = () => api.get('/auth/profile');

// Ride APIs
export const createRide = (rideData) => api.post('/rides', rideData);
export const getRides = () => api.get('/rides');
export const getRideById = (id) => api.get(`/rides/${id}`);
export const getPendingRides = () => api.get('/rides/pending');
export const acceptRide = (rideId) => api.post('/rides/accept', { rideId });
export const updateRideStatus = (id, status) => 
  api.patch(`/rides/${id}/status`, { status });

// Driver APIs
export const registerDriver = (driverData) => 
  api.post('/drivers/register', driverData);
export const getDriverProfile = () => api.get('/drivers/profile');
export const updateDriverLocation = (location) => 
  api.post('/drivers/location', location);
export const toggleDriverAvailability = () => 
  api.post('/drivers/toggle-availability');
export const getDriverRides = () => api.get('/drivers/rides');

export default api;