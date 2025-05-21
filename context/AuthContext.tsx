import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  login, 
  logout, 
  isAuthenticated, 
  getCurrentUser, 
  User,
  LoginCredentials,
  TempLoginCredentials, 
  RegisterData,
  tempLogin,
  register
} from '~/api/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  tempLogin: (credentials: TempLoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const authenticated = await isAuthenticated();
        setIsUserAuthenticated(authenticated);
        
        if (authenticated) {
          const userData = await getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login handler
  const handleLogin = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const userData = await login(credentials);
      setUser(userData);
      setIsUserAuthenticated(true);
    } finally {
      setLoading(false);
    }
  };

  // Temporary login handler
  const handleTempLogin = async (credentials: TempLoginCredentials) => {
    setLoading(true);
    try {
      const userData = await tempLogin(credentials);
      setUser(userData);
      setIsUserAuthenticated(true);
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const handleRegister = async (userData: RegisterData) => {
    setLoading(true);
    try {
      const user = await register(userData);
      setUser(user);
      setIsUserAuthenticated(true);
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
      setIsUserAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login: handleLogin,
    tempLogin: handleTempLogin,
    register: handleRegister,
    logout: handleLogout,
    isAuthenticated: isUserAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
