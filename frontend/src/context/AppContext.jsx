import React, { createContext, useContext, useReducer, useEffect } from 'react';
import SpotifyService from '../services/spotifyService';

const AppContext = createContext();

// Action types
const ACTIONS = {
  SET_USER: 'SET_USER',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  LOGOUT: 'LOGOUT',
  SET_AUTHENTICATED: 'SET_AUTHENTICATED'
};

// Initial state
const initialState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null
      };
    case ACTIONS.SET_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: action.payload
      };
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    case ACTIONS.LOGOUT:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Actions
  const setUser = (user) => {
    dispatch({ type: ACTIONS.SET_USER, payload: user });
  };

  const setLoading = (loading) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: error });
    // Auto-clear error after 5 seconds
    setTimeout(() => {
      dispatch({ type: ACTIONS.CLEAR_ERROR });
    }, 5000);
  };

  const clearError = () => {
    dispatch({ type: ACTIONS.CLEAR_ERROR });
  };

  const logout = async () => {
    try {
      setLoading(true);
      await SpotifyService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: ACTIONS.LOGOUT });
      setLoading(false);
    }
  };

  // Check authentication status on app load
  useEffect(() => {
    const checkAuthStatus = () => {
      const isAuthenticated = SpotifyService.isAuthenticated();
      
      if (isAuthenticated) {
        const userInfo = SpotifyService.getCurrentUserInfo();
        if (userInfo) {
          setUser({
            id: userInfo.id,
            spotifyId: userInfo.spotifyId,
            name: userInfo.spotifyId, // Use Spotify ID as display name
            display_name: userInfo.spotifyId
          });
        }
        dispatch({ type: ACTIONS.SET_AUTHENTICATED, payload: true });
      } else {
        dispatch({ type: ACTIONS.SET_AUTHENTICATED, payload: false });
      }
    };

    checkAuthStatus();

    // Listen for storage changes (logout in other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'jwt_token' && !e.newValue) {
        dispatch({ type: ACTIONS.LOGOUT });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const value = {
    ...state,
    setUser,
    setLoading,
    setError,
    clearError,
    logout
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};