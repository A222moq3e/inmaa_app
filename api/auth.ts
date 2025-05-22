import Constants from 'expo-constants';
const API_URL = Constants.expoConfig?.extra?.API_URL;
// Use a fallback for development if API_URL is not defined
const FALLBACK_API_URL = 'http://10.0.2.2:5006';
const EFFECTIVE_API_URL = API_URL || FALLBACK_API_URL;
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
  const response = await fetch(`${EFFECTIVE_API_URL}/auth/login`, {
    method: 'POST',
    headers,
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error(i18n.t('errors.login_failed'));
  }

  const responseData: LoginResponse = await response.json();
  const { token, user } = responseData.data;
  
  // Store token and user data
  await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  
  return user;
};

export const tempLogin = async (credentials: TempLoginCredentials): Promise<User> => {
  const headers = createHeaders();
  const response = await fetch(`${EFFECTIVE_API_URL}/login/tmp`, {
    method: 'POST',
    headers,
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || i18n.t('errors.login_failed'));
  }

  const responseData: LoginResponse = await response.json();
  const { token, user } = responseData.data;
  
  // Store token and user data
  await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  
  return user;
};

export const register = async (userData: RegisterData): Promise<User> => {
  const headers = createHeaders();
  const response = await fetch(`${EFFECTIVE_API_URL}/register/tmp`, {
    method: 'POST',
    headers,
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || i18n.t('errors.registration_failed'));
  }

  const responseData: LoginResponse = await response.json();
  const { token, user } = responseData.data;
  
  // Store token and user data
  await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  
  return user;
};

export const logout = async (): Promise<void> => {
  await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  await AsyncStorage.removeItem(USER_DATA_KEY);
  await AsyncStorage.removeItem('language-storage'); // Clear language preferences on logout
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