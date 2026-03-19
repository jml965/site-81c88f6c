const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// HTTP Client utility
class HttpClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      // Handle different response types
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        const error = new Error(data.message || `HTTP error! status: ${response.status}`);
        error.status = response.status;
        error.response = { data, status: response.status, statusText: response.statusText };
        throw error;
      }

      return { data, status: response.status, statusText: response.statusText };
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('فشل في الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.');
      }
      throw error;
    }
  }

  get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // For file uploads
  postFormData(endpoint, formData) {
    return this.request(endpoint, {
      method: 'POST',
      headers: {}, // Don't set Content-Type, let browser set it for FormData
      body: formData,
    });
  }
}

const httpClient = new HttpClient(API_BASE_URL);

// Authentication API Service
export const authApi = {
  // Authentication endpoints
  login: async (credentials) => {
    try {
      const response = await httpClient.post('/auth/login', credentials);
      return response;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await httpClient.post('/auth/register', userData);
      return response;
    } catch (error) {
      console.error('Register API error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await httpClient.post('/auth/logout');
      return response;
    } catch (error) {
      console.error('Logout API error:', error);
      throw error;
    }
  },

  refreshToken: async () => {
    try {
      const response = await httpClient.post('/auth/refresh');
      return response;
    } catch (error) {
      console.error('Refresh token API error:', error);
      throw error;
    }
  },

  // Password management
  forgotPassword: async (data) => {
    try {
      const response = await httpClient.post('/auth/forgot-password', data);
      return response;
    } catch (error) {
      console.error('Forgot password API error:', error);
      throw error;
    }
  },

  resetPassword: async (data) => {
    try {
      const response = await httpClient.post('/auth/reset-password', data);
      return response;
    } catch (error) {
      console.error('Reset password API error:', error);
      throw error;
    }
  },

  changePassword: async (data) => {
    try {
      const response = await httpClient.put('/auth/change-password', data);
      return response;
    } catch (error) {
      console.error('Change password API error:', error);
      throw error;
    }
  },

  // User profile management
  getCurrentUser: async () => {
    try {
      const response = await httpClient.get('/auth/me');
      return response;
    } catch (error) {
      console.error('Get current user API error:', error);
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await httpClient.put('/auth/profile', profileData);
      return response;
    } catch (error) {
      console.error('Update profile API error:', error);
      throw error;
    }
  },

  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await httpClient.postFormData('/auth/avatar', formData);
      return response;
    } catch (error) {
      console.error('Upload avatar API error:', error);
      throw error;
    }
  },

  deleteAvatar: async () => {
    try {
      const response = await httpClient.delete('/auth/avatar');
      return response;
    } catch (error) {
      console.error('Delete avatar API error:', error);
      throw error;
    }
  },

  // Email verification
  sendVerificationEmail: async () => {
    try {
      const response = await httpClient.post('/auth/verify-email/send');
      return response;
    } catch (error) {
      console.error('Send verification email API error:', error);
      throw error;
    }
  },

  verifyEmail: async (token) => {
    try {
      const response = await httpClient.post('/auth/verify-email', { token });
      return response;
    } catch (error) {
      console.error('Verify email API error:', error);
      throw error;
    }
  },

  // Two-factor authentication
  enableTwoFactor: async () => {
    try {
      const response = await httpClient.post('/auth/2fa/enable');
      return response;
    } catch (error) {
      console.error('Enable 2FA API error:', error);
      throw error;
    }
  },

  disableTwoFactor: async (code) => {
    try {
      const response = await httpClient.post('/auth/2fa/disable', { code });
      return response;
    } catch (error) {
      console.error('Disable 2FA API error:', error);
      throw error;
    }
  },

  verifyTwoFactor: async (code) => {
    try {
      const response = await httpClient.post('/auth/2fa/verify', { code });
      return response;
    } catch (error) {
      console.error('Verify 2FA API error:', error);
      throw error;
    }
  },

  // Account management
  deactivateAccount: async (password) => {
    try {
      const response = await httpClient.post('/auth/deactivate', { password });
      return response;
    } catch (error) {
      console.error('Deactivate account API error:', error);
      throw error;
    }
  },

  deleteAccount: async (password) => {
    try {
      const response = await httpClient.post('/auth/delete', { password });
      return response;
    } catch (error) {
      console.error('Delete account API error:', error);
      throw error;
    }
  },

  // Social login
  googleLogin: async (token) => {
    try {
      const response = await httpClient.post('/auth/google', { token });
      return response;
    } catch (error) {
      console.error('Google login API error:', error);
      throw error;
    }
  },

  facebookLogin: async (token) => {
    try {
      const response = await httpClient.post('/auth/facebook', { token });
      return response;
    } catch (error) {
      console.error('Facebook login API error:', error);
      throw error;
    }
  },

  // Session management
  getSessions: async () => {
    try {
      const response = await httpClient.get('/auth/sessions');
      return response;
    } catch (error) {
      console.error('Get sessions API error:', error);
      throw error;
    }
  },

  revokeSession: async (sessionId) => {
    try {
      const response = await httpClient.delete(`/auth/sessions/${sessionId}`);
      return response;
    } catch (error) {
      console.error('Revoke session API error:', error);
      throw error;
    }
  },

  revokeAllSessions: async () => {
    try {
      const response = await httpClient.delete('/auth/sessions');
      return response;
    } catch (error) {
      console.error('Revoke all sessions API error:', error);
      throw error;
    }
  }
};

// Mock responses for development
if (import.meta.env.VITE_USE_MOCK_API === 'true') {
  const mockUsers = [
    {
      id: 1,
      firstName: 'أحمد',
      lastName: 'محمد',
      email: 'admin@mazad.com',
      phone: '+966501234567',
      role: 'admin',
      avatar: null,
      isEmailVerified: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      firstName: 'فاطمة',
      lastName: 'علي',
      email: 'seller@mazad.com',
      phone: '+966507654321',
      role: 'seller',
      avatar: null,
      isEmailVerified: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      firstName: 'محمد',
      lastName: 'السعد',
      email: 'user@mazad.com',
      phone: '+966509876543',
      role: 'user',
      avatar: null,
      isEmailVerified: false,
      createdAt: new Date().toISOString()
    }
  ];

  const mockDelay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

  // Override API methods with mock implementations
  authApi.login = async (credentials) => {
    await mockDelay(800);
    const user = mockUsers.find(u => u.email === credentials.email);
    if (!user || credentials.password !== 'password123') {
      throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }
    const token = `mock-token-${user.id}-${Date.now()}`;
    return { data: { user, token } };
  };

  authApi.register = async (userData) => {
    await mockDelay(1000);
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('هذا البريد الإلكتروني مستخدم بالفعل');
    }
    const newUser = {
      id: mockUsers.length + 1,
      ...userData,
      avatar: null,
      isEmailVerified: false,
      createdAt: new Date().toISOString()
    };
    mockUsers.push(newUser);
    const token = `mock-token-${newUser.id}-${Date.now()}`;
    return { data: { user: newUser, token } };
  };

  authApi.getCurrentUser = async () => {
    await mockDelay(300);
    const token = localStorage.getItem('token');
    if (!token || !token.startsWith('mock-token-')) {
      throw new Error('غير مصرح');
    }
    const userId = parseInt(token.split('-')[2]);
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error('المستخدم غير موجود');
    }
    return { data: { user } };
  };

  authApi.logout = async () => {
    await mockDelay(300);
    return { data: { message: 'تم تسجيل الخروج بنجاح' } };
  };

  authApi.updateProfile = async (profileData) => {
    await mockDelay(500);
    const token = localStorage.getItem('token');
    const userId = parseInt(token.split('-')[2]);
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('المستخدم غير موجود');
    }
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...profileData };
    return { data: { user: mockUsers[userIndex] } };
  };

  authApi.changePassword = async () => {
    await mockDelay(500);
    return { data: { message: 'تم تغيير كلمة المرور بنجاح' } };
  };

  authApi.forgotPassword = async () => {
    await mockDelay(800);
    return { data: { message: 'تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني' } };
  };

  authApi.resetPassword = async () => {
    await mockDelay(500);
    return { data: { message: 'تم إعادة تعيين كلمة المرور بنجاح' } };
  };
}

export default authApi;