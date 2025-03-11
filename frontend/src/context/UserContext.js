// frontend/src/context/UserContext.js
import { createContext, useReducer } from 'react';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../services/userService';

// Create context
export const UserContext = createContext();

// Initial state
const initialState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null
};

// Reducer
const userReducer = (state, action) => {
  switch (action.type) {
    case 'GET_USERS_START':
    case 'GET_USER_START':
    case 'CREATE_USER_START':
    case 'UPDATE_USER_START':
    case 'DELETE_USER_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'GET_USERS_SUCCESS':
      return {
        ...state,
        users: action.payload.data,
        loading: false,
        error: null
      };
    case 'GET_USER_SUCCESS':
      return {
        ...state,
        currentUser: action.payload.data,
        loading: false,
        error: null
      };
    case 'CREATE_USER_SUCCESS':
      return {
        ...state,
        users: [...state.users, action.payload.data],
        loading: false,
        error: null
      };
    case 'UPDATE_USER_SUCCESS':
      return {
        ...state,
        currentUser: action.payload.data,
        users: state.users.map(user => 
          user.id === action.payload.data.id ? action.payload.data : user
        ),
        loading: false,
        error: null
      };
    case 'DELETE_USER_SUCCESS':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload),
        loading: false,
        error: null
      };
    case 'GET_USERS_FAIL':
    case 'GET_USER_FAIL':
    case 'CREATE_USER_FAIL':
    case 'UPDATE_USER_FAIL':
    case 'DELETE_USER_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'CLEAR_CURRENT_USER':
      return {
        ...state,
        currentUser: null
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
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Get all users
  const getUsers = async () => {
    dispatch({ type: 'GET_USERS_START' });
    try {
      const res = await getAllUsers();
      dispatch({
        type: 'GET_USERS_SUCCESS',
        payload: res
      });
    } catch (err) {
      dispatch({
        type: 'GET_USERS_FAIL',
        payload: err.response?.data?.message || 'Gagal memuat data pengguna'
      });
    }
  };

  // Get user by ID
  const getUser = async (userId) => {
    dispatch({ type: 'GET_USER_START' });
    try {
      const res = await getUserById(userId);
      dispatch({
        type: 'GET_USER_SUCCESS',
        payload: res
      });
    } catch (err) {
      dispatch({
        type: 'GET_USER_FAIL',
        payload: err.response?.data?.message || 'Gagal memuat data pengguna'
      });
    }
  };

  // Create user
  const addUser = async (userData) => {
    dispatch({ type: 'CREATE_USER_START' });
    try {
      const res = await createUser(userData);
      dispatch({
        type: 'CREATE_USER_SUCCESS',
        payload: res
      });
      return res.data;
    } catch (err) {
      dispatch({
        type: 'CREATE_USER_FAIL',
        payload: err.response?.data?.message || 'Gagal membuat pengguna'
      });
      throw err;
    }
  };

  // Update user
  const editUser = async (userId, userData) => {
    dispatch({ type: 'UPDATE_USER_START' });
    try {
      const res = await updateUser(userId, userData);
      dispatch({
        type: 'UPDATE_USER_SUCCESS',
        payload: res
      });
      return res.data;
    } catch (err) {
      dispatch({
        type: 'UPDATE_USER_FAIL',
        payload: err.response?.data?.message || 'Gagal memperbarui pengguna'
      });
      throw err;
    }
  };

  // Delete user
  const removeUser = async (userId) => {
    dispatch({ type: 'DELETE_USER_START' });
    try {
      await deleteUser(userId);
      dispatch({
        type: 'DELETE_USER_SUCCESS',
        payload: userId
      });
    } catch (err) {
      dispatch({
        type: 'DELETE_USER_FAIL',
        payload: err.response?.data?.message || 'Gagal menghapus pengguna'
      });
      throw err;
    }
  };

  // Clear current user
  const clearCurrentUser = () => {
    dispatch({ type: 'CLEAR_CURRENT_USER' });
  };

  // Clear errors
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <UserContext.Provider
      value={{
        users: state.users,
        currentUser: state.currentUser,
        loading: state.loading,
        error: state.error,
        getUsers,
        getUser,
        addUser,
        editUser,
        removeUser,
        clearCurrentUser,
        clearError
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;