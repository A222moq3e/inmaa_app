import apiClient from './apiClient';

/**
 * User type definition
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

/**
 * Auth token response
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data
 */
export interface RegistrationData {
  email: string;
  password: string;
  name: string;
}

/**
 * Auth service for authentication operations
 */
const authService = {
  /**
   * Login with email and password
   */
  login: async (credentials: LoginCredentials) => {
    return apiClient.post<{ user: User; tokens: AuthTokens }>('/auth/login', credentials);
  },
  
  /**
   * Register a new user
   */
  register: async (userData: RegistrationData) => {
    return apiClient.post<{ user: User; tokens: AuthTokens }>('/auth/register', userData);
  },
  
  /**
   * Logout the current user
   */
  logout: async (refreshToken: string) => {
    return apiClient.post<{ success: boolean }>('/auth/logout', { refreshToken });
  },
  
  /**
   * Get the current user profile
   */
  getCurrentUser: async (authToken: string) => {
    return apiClient.get<User>('/auth/me', { authToken });
  },
  
  /**
   * Refresh the access token
   */
  refreshToken: async (refreshToken: string) => {
    return apiClient.post<{ tokens: AuthTokens }>('/auth/refresh-token', { refreshToken });
  },
  
  /**
   * Request a password reset
   */
  forgotPassword: async (email: string) => {
    return apiClient.post<{ success: boolean }>('/auth/forgot-password', { email });
  },
  
  /**
   * Reset password with token
   */
  resetPassword: async (token: string, newPassword: string) => {
    return apiClient.post<{ success: boolean }>('/auth/reset-password', {
      token,
      newPassword,
    });
  },
};

export default authService; 