import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { Text } from '~/components/ui/text';
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar';
import { EventCard } from '~/components/ui/registration-card';
import { getUserProfile, UserProfile, EventRegistration } from '~/api/profile';
import { getEventById, Event } from '~/api/EventDetails';
import { useAuth } from '~/context/AuthContext';
import { Button } from '~/components/ui/button';
import { useTranslation } from 'react-i18next';

// Interface to store event details with registration info
interface EventWithRegistration {
  id: number;
  eventId: number;
  status: string;
  title: string;
  date: string;
  location: string;
  registrationDate: string;
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<EventWithRegistration[]>([]);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(false);

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
      
      // If there are event registrations, load the actual event details
      if (profile.eventRegistration && profile.eventRegistration.length > 0) {
        await loadEventDetails(profile.eventRegistration);
      } else {
        setEvents([]);
      }
      
      setError(null);
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError('Failed to load user profile. Please try again later.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Function to load event details for each registration
  const loadEventDetails = async (registrations: EventRegistration[]) => {
    setLoadingEvents(true);
    try {
      const eventPromises = registrations.map(async (reg) => {
        try {
          // Set query parameters for event API
          const queryParams = {
            fields: 'id,name,description,eventStart,eventEnd,location,status',
          };
          
          // Fetch event details using eventId
          const eventResponse = await getEventById(reg.eventId, queryParams);
          const eventData = eventResponse.event || (eventResponse.data?.event);
          
          if (!eventData) {
            // If event not found, return placeholder data
            return {
              id: reg.id,
              eventId: reg.eventId,
              status: reg.status,
              title: `Event #${reg.eventId}`,
              date: new Date(reg.createdAt).toLocaleDateString(),
              location: 'Unknown',
              registrationDate: new Date(reg.createdAt).toLocaleDateString(),
            };
          }
          
          // Format dates for display
          const eventDate = eventData.eventStart ? 
            new Date(eventData.eventStart).toLocaleDateString() : 
            'TBD';
            
          return {
            id: reg.id,
            eventId: reg.eventId,
            status: reg.status,
            title: eventData.name,
            date: eventDate,
            location: 'University Campus', // We could add a location field to the Event API in the future
            registrationDate: new Date(reg.createdAt).toLocaleDateString(),
          };
        } catch (err) {
          console.error(`Failed to load event ${reg.eventId}:`, err);
          // Return placeholder data on error
          return {
            id: reg.id,
            eventId: reg.eventId,
            status: reg.status,
            title: `Event #${reg.eventId}`,
            date: new Date(reg.createdAt).toLocaleDateString(),
            location: 'Error loading details',
            registrationDate: new Date(reg.createdAt).toLocaleDateString(),
          };
        }
      });
      
      // Wait for all event details to be fetched
      const eventDetails = await Promise.all(eventPromises);
      setEvents(eventDetails);
    } catch (err) {
      console.error('Failed to load event details:', err);
    } finally {
      setLoadingEvents(false);
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
          {loadingEvents ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : events && events.length > 0 ? (
            events.map(event => (
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
