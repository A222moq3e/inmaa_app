import React, { useEffect, useState } from 'react';
import { View, Image, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, router } from 'expo-router';
import { getClubByUuid, Club } from '../api/ClubDetails';
import { Text } from '~/components/ui/text';
import { useColorScheme } from '~/lib/useColorScheme';
import { Card } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { ArrowLeft } from 'lucide-react-native';

export default function ClubDetailsScreen() {
  console.log('ClubDetailsScreen');
  const { t } = useTranslation();
  const { isDarkColorScheme } = useColorScheme();
  const params = useLocalSearchParams<{ uuid: string }>();
  const clubUuid = params.uuid || '1'; // Default to '1' if no uuid provided
  
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        console.log('fetchClub', clubUuid);
        const data = await getClubByUuid(clubUuid);
        setClub(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching club:', err);
        setError(err instanceof Error ? err.message : t('errors.generic'));
      } finally {
        setLoading(false);
      }
    };

    fetchClub();
  }, [clubUuid, t]);

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('ar', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" className="text-primary" />
        <Text className="mt-4 text-foreground">{t('loading')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-background">
        <Text className="text-xl font-bold text-center text-destructive">{error}</Text>
        <Button 
          onPress={() => router.back()} 
          className="mt-6"
        >
          {t('club.go_back', 'Go Back')}
        </Button>
      </View>
    );
  }

  if (!club) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-background">
        <Text className="text-xl font-bold text-center text-destructive">{t('club.not_found')}</Text>
        <Button 
          onPress={() => router.back()} 
          className="mt-6"
        >
          {t('club.go_back', 'Go Back')}
        </Button>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
      <ScrollView>
        {/* Header Section */}
        <View className="items-center p-6 border-b border-border bg-primary/5">
          <Image 
            source={{ uri: club.logo }} 
            className="h-24 w-24 rounded-full mb-4"
            defaultSource={require('../assets/imgs/icon.png')}
          />
          <Text className="text-2xl font-bold mb-2 text-foreground text-center">{club.name}</Text>
          <View className="flex-row mt-2 flex-wrap justify-center gap-2">
            <View className="px-3 py-1.5 rounded-full bg-muted">
              <Text className="text-xs font-medium text-foreground">{club.type}</Text>
            </View>
            <View className="px-3 py-1.5 rounded-full bg-green-600">
              <Text className="text-xs font-medium text-white">{club.status}</Text>
            </View>
          </View>
        </View>

        {/* About Section */}
        <Card className="m-4 overflow-hidden">
          <View className="p-4">
            <Text className="text-lg font-bold mb-2 text-foreground">{t('club.about')}</Text>
            <Text className="text-base text-foreground/80">{club.description}</Text>
          </View>
        </Card>

        {/* Details Section */}
        <Card className="m-4 overflow-hidden">
          <View className="p-4">
            <Text className="text-lg font-bold mb-4 text-foreground">{t('club.details')}</Text>
            
            <View className="flex-row justify-between py-2 border-b border-border">
              <Text className="text-base font-semibold text-foreground">{t('club.founded')}:</Text>
              <Text className="text-base text-foreground/80">{formatDate(club.foundingDate)}</Text>
            </View>
            
            <View className="flex-row justify-between py-2 border-b border-border">
              <Text className="text-base font-semibold text-foreground">{t('club.type_label')}:</Text>
              <Text className="text-base text-foreground/80">{club.type}</Text>
            </View>
            
            <View className="flex-row justify-between py-2">
              <Text className="text-base font-semibold text-foreground">{t('club.status_label')}:</Text>
              <Text className="text-base text-foreground/80">{club.status}</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};
