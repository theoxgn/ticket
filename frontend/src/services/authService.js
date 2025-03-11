import api from './api';

// Register user
export const registerUser = async (userData) => {
  const response = await api.post('/users/register', userData);
  return response.data;
};

// Login user
export const loginUser = async (credentials) => {
  const response = await api.post('/users/login', credentials);
  return response.data;
};

// Get current user
export const getCurrentUser = async () => {
  const response = await api.get('/users/me');
  return response.data;
};