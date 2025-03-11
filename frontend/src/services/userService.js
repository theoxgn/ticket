// frontend/src/services/userService.js
import api from './api';

// Get all users
export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

// Get user by ID
export const getUserById = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

// Create user
export const createUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

// Update user
export const updateUser = async (userId, userData) => {
  const response = await api.put(`/users/${userId}`, userData);
  return response.data;
};

// Delete user
export const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};