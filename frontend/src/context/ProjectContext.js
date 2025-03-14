// frontend/src/context/ProjectContext.js
import { createContext, useReducer, useCallback } from 'react';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  addUserToProject
} from '../services/projectService';

// Create context
export const ProjectContext = createContext();

// Initial state
const initialState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null
};

// Reducer
const projectReducer = (state, action) => {
  switch (action.type) {
    case 'GET_PROJECTS_START':
    case 'GET_PROJECT_START':
    case 'CREATE_PROJECT_START':
    case 'UPDATE_PROJECT_START':
    case 'ADD_USER_TO_PROJECT_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'GET_PROJECTS_SUCCESS':
      return {
        ...state,
        projects: action.payload.data,
        loading: false,
        error: null
      };
    case 'GET_PROJECT_SUCCESS':
    case 'UPDATE_PROJECT_SUCCESS':
      return {
        ...state,
        currentProject: action.payload.data,
        loading: false,
        error: null
      };
    case 'CREATE_PROJECT_SUCCESS':
      return {
        ...state,
        projects: [...state.projects, action.payload.data],
        currentProject: action.payload.data,
        loading: false,
        error: null
      };
    case 'ADD_USER_TO_PROJECT_SUCCESS':
      return {
        ...state,
        loading: false,
        error: null
      };
    case 'GET_PROJECTS_FAIL':
    case 'GET_PROJECT_FAIL':
    case 'CREATE_PROJECT_FAIL':
    case 'UPDATE_PROJECT_FAIL':
    case 'ADD_USER_TO_PROJECT_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'CLEAR_CURRENT_PROJECT':
      return {
        ...state,
        currentProject: null
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Provider component
export const ProjectProvider = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  // Get all projects - using useCallback for stability
  const getProjects = useCallback(async () => {
    dispatch({ type: 'GET_PROJECTS_START' });
    try {
      const res = await getAllProjects();
      dispatch({
        type: 'GET_PROJECTS_SUCCESS',
        payload: res
      });
    } catch (err) {
      dispatch({
        type: 'GET_PROJECTS_FAIL',
        payload: err.response?.data?.message || 'Failed to get projects'
      });
    }
  }, []);

  // Get project by ID
  const getProject = async (projectId) => {
    dispatch({ type: 'GET_PROJECT_START' });
    try {
      const res = await getProjectById(projectId);
      dispatch({
        type: 'GET_PROJECT_SUCCESS',
        payload: res
      });
    } catch (err) {
      dispatch({
        type: 'GET_PROJECT_FAIL',
        payload: err.response?.data?.message || 'Failed to get project'
      });
    }
  };

  // Create project
  const addProject = async (projectData) => {
    dispatch({ type: 'CREATE_PROJECT_START' });
    try {
      const res = await createProject(projectData);
      dispatch({
        type: 'CREATE_PROJECT_SUCCESS',
        payload: res
      });
      return res.data;
    } catch (err) {
      dispatch({
        type: 'CREATE_PROJECT_FAIL',
        payload: err.response?.data?.message || 'Failed to create project'
      });
      throw err;
    }
  };

  // Update project
  const editProject = async (projectId, projectData) => {
    dispatch({ type: 'UPDATE_PROJECT_START' });
    try {
      const res = await updateProject(projectId, projectData);
      dispatch({
        type: 'UPDATE_PROJECT_SUCCESS',
        payload: res
      });
      return res.data;
    } catch (err) {
      dispatch({
        type: 'UPDATE_PROJECT_FAIL',
        payload: err.response?.data?.message || 'Failed to update project'
      });
      throw err;
    }
  };

  // Add user to project
  const addUserToProjectFunc = async (projectId, userData) => {
    dispatch({ type: 'ADD_USER_TO_PROJECT_START' });
    try {
      const res = await addUserToProject(projectId, userData);
      dispatch({
        type: 'ADD_USER_TO_PROJECT_SUCCESS',
        payload: res
      });
      // Refresh project data after adding user
      getProject(projectId);
      return res;
    } catch (err) {
      dispatch({
        type: 'ADD_USER_TO_PROJECT_FAIL',
        payload: err.response?.data?.message || 'Failed to add user to project'
      });
      throw err;
    }
  };

  // Clear current project
  const clearCurrentProject = () => {
    dispatch({ type: 'CLEAR_CURRENT_PROJECT' });
  };

  // Clear errors
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <ProjectContext.Provider
      value={{
        projects: state.projects,
        currentProject: state.currentProject,
        loading: state.loading,
        error: state.error,
        getProjects,
        getProject,
        addProject,
        editProject,
        addUserToProject: addUserToProjectFunc,
        clearCurrentProject,
        clearError
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};