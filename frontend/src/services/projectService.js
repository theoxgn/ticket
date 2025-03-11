import api from './api';

// Create project
export const createProject = async (projectData) => {
  const response = await api.post('/projects', projectData);
  return response.data;
};

// Get all projects
export const getAllProjects = async () => {
  const response = await api.get('/projects');
  return response.data;
};

// Get project by ID
export const getProjectById = async (projectId) => {
  const response = await api.get(`/projects/${projectId}`);
  return response.data;
};

// Update project
export const updateProject = async (projectId, projectData) => {
  const response = await api.put(`/projects/${projectId}`, projectData);
  return response.data;
};

// Add user to project
export const addUserToProject = async (projectId, userData) => {
  const response = await api.post(`/projects/${projectId}/users`, userData);
  return response.data;
};
