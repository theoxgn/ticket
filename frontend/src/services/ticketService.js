import api from './api';

// Create ticket
export const createTicket = async (ticketData) => {
  const response = await api.post('/tickets', ticketData);
  return response.data;
};

// Get all tickets
export const getAllTickets = async (filters = {}) => {
  const response = await api.get('/tickets', { params: filters });
  return response.data;
};

// Get ticket by ID
export const getTicketById = async (ticketId) => {
  const response = await api.get(`/tickets/${ticketId}`);
  return response.data;
};

// Update ticket
export const updateTicket = async (ticketId, ticketData) => {
  const response = await api.put(`/tickets/${ticketId}`, ticketData);
  return response.data;
};

// Add comment to ticket
export const addComment = async (ticketId, commentData) => {
  const response = await api.post(`/tickets/${ticketId}/comments`, commentData);
  return response.data;
};

// Update comment
export const updateComment = async (commentId, commentData) => {
  const response = await api.put(`/tickets/comments/${commentId}`, commentData);
  return response.data;
};

// Delete comment
export const deleteComment = async (commentId) => {
  const response = await api.delete(`/tickets/comments/${commentId}`);
  return response.data;
};