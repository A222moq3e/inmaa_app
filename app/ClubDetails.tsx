import React from 'react';
import { View, Text, Image, ScrollView, SafeAreaView, ViewStyle, TextStyle, ImageStyle, I18nManager } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Enable RTL layout
I18nManager.forceRTL(true);

// Mock data for the club - in a real app, this would come from props or context
const clubData = {
  id: 1,
  name: "نادي البرمجة",
  description: "نادٍ لمحبي البرمجة",
  logo: "https://placehold.co/600x400/png",
  type: "متخصص",
  status: "نشط",
  foundingDate: "2024-01-01",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z"
};

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
  detailValue: { flex: 2, fontSize: 16, color: '#333', textAlign: 'right' as const }
};

const ClubDetails = () => {
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Capitalize first letter of a string (not needed for Arabic)
  const capitalize = (str: string) => {
    return str;
  };

  return (
    <SafeAreaView style={tw.container as ViewStyle}>
      <StatusBar style="auto" />
      <ScrollView>
        <View style={tw.header as ViewStyle}>
          <Image 
            source={{ uri: clubData.logo }} 
            style={tw.logo as ImageStyle}
            defaultSource={require('../assets/imgs/icon.png')}
          />
          <Text style={tw.name as TextStyle}>{clubData.name}</Text>
          <View style={tw.badgeContainer as ViewStyle}>
            <View style={tw.badge as ViewStyle}>
              <Text style={tw.badgeText as TextStyle}>{clubData.type}</Text>
            </View>
            <View style={[tw.badge as ViewStyle, tw.statusBadge as ViewStyle]}>
              <Text style={tw.badgeText as TextStyle}>{clubData.status}</Text>
            </View>
          </View>
        </View>

        <View style={tw.section as ViewStyle}>
          <Text style={tw.sectionTitle as TextStyle}>نبذة</Text>
          <Text style={tw.description as TextStyle}>{clubData.description}</Text>
        </View>

        <View style={tw.section as ViewStyle}>
          <Text style={tw.sectionTitle as TextStyle}>التفاصيل</Text>
          <View style={tw.detailRow as ViewStyle}>
            <Text style={tw.detailLabel as TextStyle}>تأسس في:</Text>
            <Text style={tw.detailValue as TextStyle}>{formatDate(clubData.foundingDate)}</Text>
          </View>
          <View style={tw.detailRow as ViewStyle}>
            <Text style={tw.detailLabel as TextStyle}>النوع:</Text>
            <Text style={tw.detailValue as TextStyle}>{clubData.type}</Text>
          </View>
          <View style={tw.detailRow as ViewStyle}>
            <Text style={tw.detailLabel as TextStyle}>الحالة:</Text>
            <Text style={tw.detailValue as TextStyle}>{clubData.status}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ClubDetails;
