// frontend/src/context/TicketContext.js
import { createContext, useReducer, useCallback } from 'react';
import {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  addComment,
  updateComment,
  deleteComment
} from '../services/ticketService';

// Create context
export const TicketContext = createContext();

// Initial state
const initialState = {
  tickets: [],
  currentTicket: null,
  loading: false,
  error: null
};

// Reducer
const ticketReducer = (state, action) => {
  switch (action.type) {
    case 'GET_TICKETS_START':
    case 'GET_TICKET_START':
    case 'CREATE_TICKET_START':
    case 'UPDATE_TICKET_START':
    case 'ADD_COMMENT_START':
    case 'UPDATE_COMMENT_START':
    case 'DELETE_COMMENT_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'GET_TICKETS_SUCCESS':
      return {
        ...state,
        tickets: action.payload.data,
        loading: false,
        error: null
      };
    case 'GET_TICKET_SUCCESS':
      return {
        ...state,
        currentTicket: action.payload.data,
        loading: false,
        error: null
      };
    case 'CREATE_TICKET_SUCCESS':
      return {
        ...state,
        tickets: [...state.tickets, action.payload.data],
        loading: false,
        error: null
      };
    case 'UPDATE_TICKET_SUCCESS':
      return {
        ...state,
        currentTicket: action.payload.data,
        tickets: state.tickets.map(ticket => 
          ticket.id === action.payload.data.id ? action.payload.data : ticket
        ),
        loading: false,
        error: null
      };
    case 'ADD_COMMENT_SUCCESS':
      return {
        ...state,
        currentTicket: {
          ...state.currentTicket,
          comments: [...state.currentTicket.comments, action.payload.data]
        },
        loading: false,
        error: null
      };
    case 'UPDATE_COMMENT_SUCCESS':
      return {
        ...state,
        currentTicket: {
          ...state.currentTicket,
          comments: state.currentTicket.comments.map(comment =>
            comment.id === action.payload.data.id ? action.payload.data : comment
          )
        },
        loading: false,
        error: null
      };
    case 'DELETE_COMMENT_SUCCESS':
      return {
        ...state,
        currentTicket: {
          ...state.currentTicket,
          comments: state.currentTicket.comments.filter(
            comment => comment.id !== action.payload
          )
        },
        loading: false,
        error: null
      };
    case 'GET_TICKETS_FAIL':
    case 'GET_TICKET_FAIL':
    case 'CREATE_TICKET_FAIL':
    case 'UPDATE_TICKET_FAIL':
    case 'ADD_COMMENT_FAIL':
    case 'UPDATE_COMMENT_FAIL':
    case 'DELETE_COMMENT_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'CLEAR_CURRENT_TICKET':
      return {
        ...state,
        currentTicket: null
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
export const TicketProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ticketReducer, initialState);

  // Get all tickets - menggunakan useCallback untuk menstabilkan fungsi
  const getTickets = useCallback(async (filters = {}) => {
    dispatch({ type: 'GET_TICKETS_START' });
    try {
      const res = await getAllTickets(filters);
      dispatch({
        type: 'GET_TICKETS_SUCCESS',
        payload: res
      });
    } catch (err) {
      dispatch({
        type: 'GET_TICKETS_FAIL',
        payload: err.response?.data?.message || 'Failed to get tickets'
      });
    }
  }, []);

  // Get ticket by ID - menggunakan useCallback untuk menstabilkan fungsi
  const getTicket = useCallback(async (ticketId) => {
    if (!ticketId) return;
    
    dispatch({ type: 'GET_TICKET_START' });
    try {
      const res = await getTicketById(ticketId);
      dispatch({
        type: 'GET_TICKET_SUCCESS',
        payload: res
      });
    } catch (err) {
      dispatch({
        type: 'GET_TICKET_FAIL',
        payload: err.response?.data?.message || 'Failed to get ticket'
      });
    }
  }, []);

  // Create ticket - menggunakan useCallback untuk menstabilkan fungsi
  const addTicket = useCallback(async (ticketData) => {
    dispatch({ type: 'CREATE_TICKET_START' });
    try {
      const res = await createTicket(ticketData);
      dispatch({
        type: 'CREATE_TICKET_SUCCESS',
        payload: res
      });
      return res.data;
    } catch (err) {
      dispatch({
        type: 'CREATE_TICKET_FAIL',
        payload: err.response?.data?.message || 'Failed to create ticket'
      });
      throw err;
    }
  }, []);

  // Update ticket - menggunakan useCallback untuk menstabilkan fungsi
  const editTicket = useCallback(async (ticketId, ticketData) => {
    if (!ticketId) return;
    
    dispatch({ type: 'UPDATE_TICKET_START' });
    try {
      const res = await updateTicket(ticketId, ticketData);
      dispatch({
        type: 'UPDATE_TICKET_SUCCESS',
        payload: res
      });
      return res.data;
    } catch (err) {
      dispatch({
        type: 'UPDATE_TICKET_FAIL',
        payload: err.response?.data?.message || 'Failed to update ticket'
      });
      throw err;
    }
  }, []);

  // Add comment to ticket - menggunakan useCallback untuk menstabilkan fungsi
  const addTicketComment = useCallback(async (ticketId, commentData) => {
    if (!ticketId) return;
    
    dispatch({ type: 'ADD_COMMENT_START' });
    try {
      const res = await addComment(ticketId, commentData);
      dispatch({
        type: 'ADD_COMMENT_SUCCESS',
        payload: res
      });
      return res.data;
    } catch (err) {
      dispatch({
        type: 'ADD_COMMENT_FAIL',
        payload: err.response?.data?.message || 'Failed to add comment'
      });
      throw err;
    }
  }, []);

  // Update comment - menggunakan useCallback untuk menstabilkan fungsi
  const editComment = useCallback(async (commentId, commentData) => {
    if (!commentId) return;
    
    dispatch({ type: 'UPDATE_COMMENT_START' });
    try {
      const res = await updateComment(commentId, commentData);
      dispatch({
        type: 'UPDATE_COMMENT_SUCCESS',
        payload: res
      });
      return res.data;
    } catch (err) {
      dispatch({
        type: 'UPDATE_COMMENT_FAIL',
        payload: err.response?.data?.message || 'Failed to update comment'
      });
      throw err;
    }
  }, []);

  // Delete comment - menggunakan useCallback untuk menstabilkan fungsi
  const removeComment = useCallback(async (commentId) => {
    if (!commentId) return;
    
    dispatch({ type: 'DELETE_COMMENT_START' });
    try {
      await deleteComment(commentId);
      dispatch({
        type: 'DELETE_COMMENT_SUCCESS',
        payload: commentId
      });
    } catch (err) {
      dispatch({
        type: 'DELETE_COMMENT_FAIL',
        payload: err.response?.data?.message || 'Failed to delete comment'
      });
      throw err;
    }
  }, []);

  // Clear current ticket - menggunakan useCallback untuk menstabilkan fungsi
  const clearCurrentTicket = useCallback(() => {
    dispatch({ type: 'CLEAR_CURRENT_TICKET' });
  }, []);

  // Clear errors - menggunakan useCallback untuk menstabilkan fungsi
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  return (
    <TicketContext.Provider
      value={{
        tickets: state.tickets,
        currentTicket: state.currentTicket,
        loading: state.loading,
        error: state.error,
        getTickets,
        getTicket,
        addTicket,
        editTicket,
        addTicketComment,
        editComment,
        removeComment,
        clearCurrentTicket,
        clearError
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};