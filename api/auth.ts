import Constants from 'expo-constants';
const API_URL = Constants.expoConfig?.extra?.API_URL;
// Use a fallback for development if API_URL is not defined
const FALLBACK_API_URL = 'http://10.0.2.2:5000';
const EFFECTIVE_API_URL = API_URL || FALLBACK_API_URL;

// Log API configuration for debugging
console.log('Auth API Configuration:');
console.log('API_URL from Constants:', API_URL);
console.log('FALLBACK_API_URL:', FALLBACK_API_URL);
console.log('EFFECTIVE_API_URL being used:', EFFECTIVE_API_URL);

import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';
import { clearAllProfileCaches } from './profile';

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface TempLoginCredentials {
  email: string;
  nationalId: string;
}

export interface RegisterData {
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface User {
  id?: number;
  uuid?: string;
  email: string;
  name?: string;
  role?: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  nationalId?: number;
  phoneNumber?: string;
  providers?: string[];
}

export interface LoginResponse {
  data: {
    token: string;
    user: User;
  }
}

// AsyncStorage Keys
const AUTH_TOKEN_KEY = 'authToken';
const USER_DATA_KEY = 'userData';

// Helper to create headers with language support
const createHeaders = (includeContentType = true): Record<string, string> => {
  const headers: Record<string, string> = {
    'Accept-Language': 'ar' // Set Arabic as preferred language
  };
  
  if (includeContentType) {
    headers['Content-Type'] = 'application/json; charset=UTF-8';
  }
  
  return headers;
};

// Auth Functions
export const login = async (credentials: LoginCredentials): Promise<User> => {
  const headers = createHeaders();
  const requestUrl = `${EFFECTIVE_API_URL}/auth/login`;
  
  // Debug logs
  console.log('Login request details:');
  console.log('URL:', requestUrl);
  console.log('Headers:', JSON.stringify(headers));
  console.log('Body:', JSON.stringify(credentials));
  
  try {
    const response = await fetch(requestUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(credentials),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', JSON.stringify(response.headers));
    
    // Try to get response body regardless of success
    const responseText = await response.text();
    console.log('Response body:', responseText);
    
    if (!response.ok) {
      throw new Error(`${i18n.t('errors.login_failed')} - Status: ${response.status}, Response: ${responseText}`);
    }

    // Parse the response after logging it as text
    const responseData = JSON.parse(responseText) as LoginResponse;
    const { token, user } = responseData.data;
    
    // Store token and user data
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    
    return user;
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(`${i18n.t('errors.login_failed')} - ${String(error)}`);
    }
  }
};

export const tempLogin = async (credentials: TempLoginCredentials): Promise<User> => {
  const headers = createHeaders();
  const requestUrl = `${EFFECTIVE_API_URL}/login/tmp`;
  
  // Debug logs
  console.log('Temp login request details:');
  console.log('URL:', requestUrl);
  console.log('Headers:', JSON.stringify(headers));
  console.log('Body:', JSON.stringify(credentials));
  
  try {
    const response = await fetch(requestUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(credentials),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', JSON.stringify(response.headers));
    
    // Try to get response body regardless of success
    const responseText = await response.text();
    console.log('Response body:', responseText);
    
    if (!response.ok) {
      throw new Error(`${i18n.t('errors.login_failed')} - Status: ${response.status}, Response: ${responseText}`);
    }

    // Parse the response after logging it as text
    const responseData = JSON.parse(responseText) as LoginResponse;
    const { token, user } = responseData.data;
    
    // Store token and user data
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    
    return user;
  } catch (error) {
    console.error('Temp login error:', error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(`${i18n.t('errors.login_failed')} - ${String(error)}`);
    }
  }
};

export const register = async (userData: RegisterData): Promise<User> => {
  const headers = createHeaders();
  const requestUrl = `${EFFECTIVE_API_URL}/register/tmp`;
  
  // Debug logs
  console.log('Register request details:');
  console.log('URL:', requestUrl);
  console.log('Headers:', JSON.stringify(headers));
  console.log('Body:', JSON.stringify(userData));
  
  try {
    const response = await fetch(requestUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(userData),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', JSON.stringify(response.headers));
    
    // Try to get response body regardless of success
    const responseText = await response.text();
    console.log('Response body:', responseText);
    
    if (!response.ok) {
      throw new Error(`${i18n.t('errors.registration_failed')} - Status: ${response.status}, Response: ${responseText}`);
    }

    // Parse the response after logging it as text
    const responseData = JSON.parse(responseText) as LoginResponse;
    const { token, user } = responseData.data;
    
    // Store token and user data
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    
    return user;
  } catch (error) {
    console.error('Register error:', error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(`${i18n.t('errors.registration_failed')} - ${String(error)}`);
    }
  }
};

export const logout = async (): Promise<void> => {
  await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  await AsyncStorage.removeItem(USER_DATA_KEY);
  await clearAllProfileCaches(); // Clear all profile caches on logout
};

export const isAuthenticated = async (): Promise<boolean> => {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  return token !== null;
};

export const getCurrentUser = async (): Promise<User | null> => {
  const userData = await AsyncStorage.getItem(USER_DATA_KEY);
  if (!userData) return null;
  
  try {
    return JSON.parse(userData) as User;
  } catch (error) {
    console.error(i18n.t('errors.user_data_error'), error);
    return null;
  }
};

export const getAuthToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
};

// Helper function to create headers with authentication
export const createAuthHeaders = async (includeContentType = true): Promise<Record<string, string>> => {
  const headers: Record<string, string> = {
    'Accept-Language': 'ar' // Set Arabic as preferred language
  };
  
  const token = await getAuthToken();
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (includeContentType) {
    headers['Content-Type'] = 'application/json; charset=UTF-8';
  }
  
  return headers;
};

// Diagnostic function to test API connectivity
export const testConnection = async (): Promise<{success: boolean, details: string}> => {
  console.log(`Testing connection to: ${EFFECTIVE_API_URL}`);
  
  try {
    // Attempt to connect to the API server
    const response = await fetch(`${EFFECTIVE_API_URL}/health`, {
      method: 'GET',
      headers: createHeaders(false),
    });
    
    console.log('Connection test response status:', response.status);
    
    // Try a second endpoint if /health fails
    if (!response.ok) {
      console.log('Health endpoint failed, trying root endpoint');
      const rootResponse = await fetch(EFFECTIVE_API_URL, {
        method: 'GET',
        headers: createHeaders(false),
      });
      
      console.log('Root endpoint response status:', rootResponse.status);
      
      if (rootResponse.ok) {
        return {
          success: true,
          details: `Connected to root endpoint with status ${rootResponse.status}`
        };
      }
    } else {
      return {
        success: true,
        details: `Connected to health endpoint with status ${response.status}`
      };
    }
    
    return {
      success: false,
      details: `Failed to connect to API. Status: ${response.status}`
    };
  } catch (error) {
    console.error('Connection test error:', error);
    return {
      success: false,
      details: `Connection error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}; 