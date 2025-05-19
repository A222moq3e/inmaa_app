import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, SafeAreaView, ViewStyle, TextStyle, ImageStyle, I18nManager } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { getClubByUuid, Club } from '../api/ClubDetails';

// Enable RTL layout
I18nManager.forceRTL(true);

// Inline style objects that mimic Tailwind/NativeWind classes
const tw: Record<string, ViewStyle | TextStyle | ImageStyle> = {
  container: { flex: 1, backgroundColor: '#fff' },
  header: { alignItems: 'center' as const, padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  logo: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  name: { fontSize: 24, fontWeight: 'bold' as const, marginBottom: 10, textAlign: 'right' as const },
  badgeContainer: { flexDirection: 'row-reverse' as const, marginTop: 5 },
  badge: { backgroundColor: '#e0e0e0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginHorizontal: 5 },
  statusBadge: { backgroundColor: '#4CAF50' },
  badgeText: { color: '#fff', fontWeight: '600' as const, fontSize: 12, textAlign: 'right' as const },
  section: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' as const, marginBottom: 10, color: '#333', textAlign: 'right' as const },
  description: { fontSize: 16, lineHeight: 24, color: '#555', textAlign: 'right' as const },
  detailRow: { flexDirection: 'row-reverse' as const, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  detailLabel: { flex: 1, fontSize: 16, color: '#666', textAlign: 'right' as const },
  detailValue: { flex: 2, fontSize: 16, color: '#333', textAlign: 'right' as const },
  error: { color: 'red', textAlign: 'center', padding: 20, fontFamily: 'Arial', fontSize: 16 },
  loading: { textAlign: 'center', padding: 20, fontFamily: 'Arial', fontSize: 16 }
};

interface ClubDetailsProps {
  clubUuid: string;
}

const ClubDetails: React.FC<ClubDetailsProps> = ({ clubUuid }) => {
  const { t } = useTranslation();
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const data = await getClubByUuid(clubUuid);
        console.log('data', data);
        
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
    return <Text style={tw.loading as TextStyle}>{t('loading')}</Text>;
  }

  if (error) {
    return <Text style={tw.error as TextStyle}>{error}</Text>;
  }

  if (!club) {
    return <Text style={tw.error as TextStyle}>{t('club.not_found')}</Text>;
  }

  return (
    <SafeAreaView style={tw.container as ViewStyle}>
      <StatusBar style="auto" />
      <ScrollView>
        <View style={tw.header as ViewStyle}>
          <Image 
            source={{ uri: club.logo }} 
            style={tw.logo as ImageStyle}
            defaultSource={require('../assets/imgs/icon.png')}
          />
          <Text style={tw.name as TextStyle}>{club.name}</Text>
          <View style={tw.badgeContainer as ViewStyle}>
            <View style={tw.badge as ViewStyle}>
              <Text style={tw.badgeText as TextStyle}>{club.type}</Text>
            </View>
            <View style={[tw.badge as ViewStyle, tw.statusBadge as ViewStyle]}>
              <Text style={tw.badgeText as TextStyle}>{club.status}</Text>
            </View>
          </View>
        </View>

        <View style={tw.section as ViewStyle}>
          <Text style={tw.sectionTitle as TextStyle}>{t('club.about')}</Text>
          <Text style={tw.description as TextStyle}>{club.description}</Text>
        </View>

        <View style={tw.section as ViewStyle}>
          <Text style={tw.sectionTitle as TextStyle}>{t('club.details')}</Text>
          <View style={tw.detailRow as ViewStyle}>
            <Text style={tw.detailLabel as TextStyle}>{t('club.founded')}:</Text>
            <Text style={tw.detailValue as TextStyle}>{formatDate(club.foundingDate)}</Text>
          </View>
          <View style={tw.detailRow as ViewStyle}>
            <Text style={tw.detailLabel as TextStyle}>{t('club.type_label')}:</Text>
            <Text style={tw.detailValue as TextStyle}>{club.type}</Text>
          </View>
          <View style={tw.detailRow as ViewStyle}>
            <Text style={tw.detailLabel as TextStyle}>{t('club.status_label')}:</Text>
            <Text style={tw.detailValue as TextStyle}>{club.status}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ClubDetails;
