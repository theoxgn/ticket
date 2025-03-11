// frontend/src/context/AuthContext.js
import { createContext, useReducer, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser } from '../services/authService';

// Create context
export const AuthContext = createContext();

// Initial state
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
    case 'LOAD_USER_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'LOAD_USER_SUCCESS':
      return {
        ...state,
        user: action.payload.data,
        loading: false,
        isAuthenticated: true,
        error: null
      };
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
    case 'LOAD_USER_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
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
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on initial render if token exists
  useEffect(() => {
    if (state.token) {
      loadUser();
    }
  }, []);

  // Register user
  const register = async (userData) => {
    dispatch({ type: 'REGISTER_START' });
    try {
      const res = await registerUser(userData);
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res
      });
    } catch (err) {
      dispatch({
        type: 'REGISTER_FAIL',
        payload: err.response?.data?.message || 'Registration failed'
      });
    }
  };

  // Login user
  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const res = await loginUser(credentials);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res
      });
    } catch (err) {
      dispatch({
        type: 'LOGIN_FAIL',
        payload: err.response?.data?.message || 'Authentication failed'
      });
    }
  };

  // Load user data
  const loadUser = async () => {
    dispatch({ type: 'LOAD_USER_START' });
    try {
      const res = await getCurrentUser();
      dispatch({
        type: 'LOAD_USER_SUCCESS',
        payload: res
      });
    } catch (err) {
      dispatch({
        type: 'LOAD_USER_FAIL',
        payload: err.response?.data?.message || 'Failed to load user data'
      });
      // If token is invalid or expired, logout
      if (err.response?.status === 401) {
        logout();
      }
    }
  };

  // Logout user
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Clear errors
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        error: state.error,
        register,
        login,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};