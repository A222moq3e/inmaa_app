import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router, usePathname } from 'expo-router';
import { useAuth } from '~/context/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
}

const publicRoutes = ['/login', '/register'];

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
  
  useEffect(() => {
    // Don't run navigation logic while auth state is loading
    if (loading) return;
    
    const isPublicRoute = publicRoutes.includes(pathname);
    
    if (!isAuthenticated && !isPublicRoute) {
      // Redirect to login if not authenticated and trying to access protected route
      router.replace('/login');
    } else if (isAuthenticated && isPublicRoute) {
      // Redirect to home if already authenticated and trying to access login/register
      router.replace('/');
    }
  }, [isAuthenticated, loading, pathname]);
  
  // Show loading indicator while checking auth status
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  
  return <>{children}</>;
};
