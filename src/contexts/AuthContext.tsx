import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Services
import authService, { User, LoginCredentials, RegistrationData, AuthTokens } from '@/services/authService';

// Constants
const AUTH_TOKENS_KEY = 'auth_tokens';
const USER_DATA_KEY = 'user_data';

// Types
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  tokens: AuthTokens | null;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegistrationData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    tokens: null,
  });

  // Initialize auth state from storage
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const [userDataJson, tokensJson] = await Promise.all([
          AsyncStorage.getItem(USER_DATA_KEY),
          AsyncStorage.getItem(AUTH_TOKENS_KEY),
        ]);

        if (userDataJson && tokensJson) {
          const userData = JSON.parse(userDataJson) as User;
          const tokens = JSON.parse(tokensJson) as AuthTokens;
          
          setState({
            user: userData,
            tokens,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Failed to load auth state:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadAuthState();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const response = await authService.login(credentials);
      
      if (response.success && response.data) {
        const { user, tokens } = response.data;
        
        // Save to state
        setState({
          user,
          tokens,
          isAuthenticated: true,
          isLoading: false,
        });
        
        // Save to storage
        await Promise.all([
          AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user)),
          AsyncStorage.setItem(AUTH_TOKENS_KEY, JSON.stringify(tokens)),
        ]);
        
        return true;
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  // Register function
  const register = async (data: RegistrationData): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const response = await authService.register(data);
      
      if (response.success && response.data) {
        const { user, tokens } = response.data;
        
        // Save to state
        setState({
          user,
          tokens,
          isAuthenticated: true,
          isLoading: false,
        });
        
        // Save to storage
        await Promise.all([
          AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user)),
          AsyncStorage.setItem(AUTH_TOKENS_KEY, JSON.stringify(tokens)),
        ]);
        
        return true;
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      if (state.tokens?.refreshToken) {
        await authService.logout(state.tokens.refreshToken);
      }
      
      // Clear storage
      await Promise.all([
        AsyncStorage.removeItem(USER_DATA_KEY),
        AsyncStorage.removeItem(AUTH_TOKENS_KEY),
      ]);
      
      // Reset state
      setState({
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Update user data
  const updateUser = (userData: Partial<User>) => {
    if (!state.user) return;
    
    const updatedUser = { ...state.user, ...userData };
    setState(prev => ({ ...prev, user: updatedUser }));
    
    // Update storage
    AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser))
      .catch(error => console.error('Failed to update user data in storage:', error));
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
} 