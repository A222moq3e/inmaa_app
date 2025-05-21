import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { Text } from '~/components/ui/text';
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar';
import { EventCard } from '~/components/ui/event-card';
import { getUserProfile, UserProfile, EventRegistration } from '~/api/profile';
import { useAuth } from '~/context/AuthContext';
import { Button } from '~/components/ui/button';
import { useTranslation } from 'react-i18next';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadUserProfile = async (forceRefresh = false) => {
    try {
      if (!user || (!user.id && !user.uuid)) {
        setError('User ID not found in auth state');
        setIsLoading(false);
        return;
      }
      
      // Use either id or uuid depending on what's available
      const userId = user.id || user.uuid || '';
      const profile = await getUserProfile(userId, undefined, undefined, forceRefresh);
      setUserProfile(profile);
      setError(null);
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError('Failed to load user profile. Please try again later.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Initial profile load
  useEffect(() => {
    loadUserProfile();
  }, [user]);

  // Pull to refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    loadUserProfile(true); // Force refresh from API
  };

  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      t('profile.logoutConfirmTitle', 'Logout'),
      t('profile.logoutConfirmMessage', 'Are you sure you want to logout?'),
      [
        { text: t('profile.cancel', 'Cancel'), style: 'cancel' },
        { 
          text: t('profile.logout', 'Logout'), 
          style: 'destructive',
          onPress: () => logout() 
        },
      ]
    );
  };

  // Format event registration data for the event card component
  const formatEventData = (registrations: EventRegistration[] = []) => {
    return registrations.map(reg => ({
      id: reg.id,
      eventId: reg.eventId,
      status: reg.status,
      date: new Date(reg.createdAt).toLocaleDateString(),
      // These would come from the actual event data in a complete implementation
      title: `Event #${reg.eventId}`,
      location: 'University Campus'
    }));
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-background">
        <Text className="text-xl font-bold text-center text-destructive">{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1 bg-background"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Profile Header */}
      <View className="p-6 bg-primary/5 border-b border-border">
        <View className="flex-row items-center space-x-6 mb-4">
          <Avatar className="h-20 w-20" alt={`${userProfile?.firstName || ''} ${userProfile?.lastName || ''} profile picture`}>
            {userProfile?.profileImage ? (
              <AvatarImage 
                source={{ uri: userProfile.profileImage }} 
              />
            ) : (
              <AvatarFallback>
                <Text className="text-2xl font-bold">
                  {userProfile?.firstName?.charAt(0) || ''}
                  {userProfile?.lastName?.charAt(0) || ''}
                </Text>
              </AvatarFallback>
            )}
          </Avatar>
          <View className="flex-1 ml-2">
            <Text className="text-2xl font-bold">{userProfile?.displayName}</Text>
            <Text className="text-muted-foreground">{userProfile?.email}</Text>
          </View>
        </View>
        
        {/* Logout button */}
        <Button 
          onPress={handleLogout} 
          className="mt-2 bg-destructive"
        >
          {t('profile.logout', 'Logout')}
        </Button>
      </View>

      {/* User Information */}
      <View className="p-6">

        {/* Registered Events */}
        <View className="mb-6">
          <Text className="text-xl font-bold mb-4">{t('profile.registeredEvents', 'Registered Events')}</Text>
          {userProfile?.eventRegistration && userProfile.eventRegistration.length > 0 ? (
            formatEventData(userProfile.eventRegistration).map(event => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <View className="py-8 items-center">
              <Text className="text-muted-foreground text-center">
                {t('profile.noEvents', "You haven't registered for any events yet.")}
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
