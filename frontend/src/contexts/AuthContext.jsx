import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authApi } from '../services/authApi';

// Auth State
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Auth Actions
const authActions = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  UPDATE_PROFILE_SUCCESS: 'UPDATE_PROFILE_SUCCESS',
  UPDATE_PROFILE_FAILURE: 'UPDATE_PROFILE_FAILURE',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_USER: 'SET_USER'
};

// Auth Reducer
function authReducer(state, action) {
  switch (action.type) {
    case authActions.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
        error: null
      };
      
    case authActions.LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
      
    case authActions.LOGIN_FAILURE:
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
      
    case authActions.REGISTER_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
      
    case authActions.REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
      
    case authActions.LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
      
    case authActions.UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        user: action.payload,
        error: null
      };
      
    case authActions.UPDATE_PROFILE_FAILURE:
      return {
        ...state,
        error: action.payload
      };
      
    case authActions.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
      
    case authActions.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false
      };
      
    default:
      return state;
  }
}

// Create Context
const AuthContext = createContext();

// Auth Provider Component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authApi.getCurrentUser();
          dispatch({
            type: authActions.SET_USER,
            payload: response.data.user
          });
        } catch (error) {
          console.error('Failed to get current user:', error);
          localStorage.removeItem('token');
          dispatch({
            type: authActions.SET_USER,
            payload: null
          });
        }
      } else {
        dispatch({
          type: authActions.SET_USER,
          payload: null
        });
      }
    };

    initAuth();
  }, []);

  // Auth Methods
  const login = async (email, password) => {
    try {
      dispatch({ type: authActions.SET_LOADING, payload: true });
      
      const response = await authApi.login({ email, password });
      
      dispatch({
        type: authActions.LOGIN_SUCCESS,
        payload: {
          user: response.data.user,
          token: response.data.token
        }
      });
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'فشل في تسجيل الدخول';
      dispatch({
        type: authActions.LOGIN_FAILURE,
        payload: errorMessage
      });
      throw new Error(errorMessage);
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: authActions.SET_LOADING, payload: true });
      
      const response = await authApi.register(userData);
      
      dispatch({
        type: authActions.REGISTER_SUCCESS,
        payload: {
          user: response.data.user,
          token: response.data.token
        }
      });
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'فشل في إنشاء الحساب';
      dispatch({
        type: authActions.REGISTER_FAILURE,
        payload: errorMessage
      });
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: authActions.LOGOUT });
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authApi.updateProfile(profileData);
      
      dispatch({
        type: authActions.UPDATE_PROFILE_SUCCESS,
        payload: response.data.user
      });
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'فشل في تحديث الملف الشخصي';
      dispatch({
        type: authActions.UPDATE_PROFILE_FAILURE,
        payload: errorMessage
      });
      throw new Error(errorMessage);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await authApi.changePassword({
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'فشل في تغيير كلمة المرور';
      throw new Error(errorMessage);
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await authApi.forgotPassword({ email });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'فشل في إرسال رابط استعادة كلمة المرور';
      throw new Error(errorMessage);
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const response = await authApi.resetPassword({ token, password });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'فشل في إعادة تعيين كلمة المرور';
      throw new Error(errorMessage);
    }
  };

  const clearError = () => {
    dispatch({ type: authActions.CLEAR_ERROR });
  };

  // Helper methods
  const hasRole = (role) => {
    return state.user?.role === role;
  };

  const hasPermission = (permission) => {
    return state.user?.permissions?.includes(permission) || false;
  };

  const isAdmin = () => hasRole('admin');
  const isSeller = () => hasRole('seller');
  const isUser = () => hasRole('user');

  const value = {
    // State
    ...state,
    
    // Methods
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    clearError,
    
    // Helper methods
    hasRole,
    hasPermission,
    isAdmin,
    isSeller,
    isUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}