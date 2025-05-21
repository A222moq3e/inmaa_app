import Constants from 'expo-constants';
const API_URL = Constants.expoConfig?.extra?.API_URL;
// Use a fallback for development if API_URL is not defined
const FALLBACK_API_URL = 'http://10.0.2.2:5006';
const EFFECTIVE_API_URL = API_URL || FALLBACK_API_URL;

console.log('API URL Configuration:', { API_URL, FALLBACK_API_URL, EFFECTIVE_API_URL });

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
  const url = `${EFFECTIVE_API_URL}/auth/login`;
  console.log('Login Request URL:', url);
  console.log('Login Request Headers:', headers);
  console.log('Login Request Body:', JSON.stringify(credentials));
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(credentials),
    });

    console.log('Login Response Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Login Error Response:', errorText);
      throw new Error(i18n.t('errors.login_failed'));
    }

    const responseData: LoginResponse = await response.json();
    console.log('Login Success:', { user: responseData.data.user });
    const { token, user } = responseData.data;
    
    // Store token and user data
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    
    return user;
  } catch (error) {
    console.log('Login Fetch Error:', error);
    throw error;
  }
};

export const tempLogin = async (credentials: TempLoginCredentials): Promise<User> => {
  const headers = createHeaders();
  const url = `${EFFECTIVE_API_URL}/login/tmp`;
  console.log('Temp Login Request URL:', url);
  console.log('Temp Login Request Headers:', headers);
  console.log('Temp Login Request Body:', JSON.stringify(credentials));
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(credentials),
    });

    console.log('Temp Login Response Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Temp Login Error Response:', errorText);
      const errorData = JSON.parse(errorText);
      throw new Error(errorData.error || i18n.t('errors.login_failed'));
    }

    const responseData: LoginResponse = await response.json();
    console.log('Temp Login Success:', { user: responseData.data.user });
    const { token, user } = responseData.data;
    
    // Store token and user data
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    
    return user;
  } catch (error) {
    console.log('Temp Login Fetch Error:', error);
    throw error;
  }
};

export const register = async (userData: RegisterData): Promise<User> => {
  const headers = createHeaders();
  const url = `${EFFECTIVE_API_URL}/register/tmp`;
  console.log('Register Request URL:', url);
  console.log('Register Request Headers:', headers);
  console.log('Register Request Body:', JSON.stringify(userData));
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(userData),
    });

    console.log('Register Response Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Register Error Response:', errorText);
      const errorData = JSON.parse(errorText);
      throw new Error(errorData.error || i18n.t('errors.registration_failed'));
    }

    const responseData: LoginResponse = await response.json();
    console.log('Register Success:', { user: responseData.data.user });
    const { token, user } = responseData.data;
    
    // Store token and user data
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    
    return user;
  } catch (error) {
    console.log('Register Fetch Error:', error);
    throw error;
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
  
  console.log('Generated Auth Headers:', headers);
  return headers;
}; 