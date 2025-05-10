import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Theme
import { useThemeColor } from '@/hooks/useThemeColor';

// Mock data (replace with actual API calls)
const MOCK_CLUBS = [
  {
    id: 1,
    name: 'Programming Club',
    description: 'A club for programming enthusiasts',
    logo: 'https://via.placeholder.com/150',
    type: 'specialized',
    status: 'active',
  },
  {
    id: 2,
    name: 'Chess Club',
    description: 'For chess lovers and strategic thinkers',
    logo: 'https://via.placeholder.com/150',
    type: 'general',
    status: 'active',
  },
  {
    id: 3,
    name: 'Art Club',
    description: 'Express your creativity through art',
    logo: 'https://via.placeholder.com/150',
    type: 'specialized',
    status: 'active',
  },
];

export default function ClubsScreen() {
  const [clubs, setClubs] = useState(MOCK_CLUBS);
  const [loading, setLoading] = useState(false);
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const navigation = useNavigation();

  // Fetch clubs from API (replace mock implementation)
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        // const response = await fetch('https://api.example.com/clubs');
        // const data = await response.json();
        // setClubs(data.data.clubs);
        
        // Using mock data for now
        setTimeout(() => {
          setClubs(MOCK_CLUBS);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching clubs:', error);
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  const renderClubItem = ({ item }) => {
    return (
      <TouchableOpacity 
        style={[styles.clubCard, { backgroundColor: useThemeColor({}, 'card') }]}
        onPress={() => navigation.navigate('ClubDetails', { clubId: item.id })}
      >
        <Image source={{ uri: item.logo }} style={styles.clubLogo} />
        <View style={styles.clubInfo}>
          <Text style={[styles.clubName, { color: textColor }]}>{item.name}</Text>
          <Text style={[styles.clubDescription, { color: textColor }]} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.clubMeta}>
            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>{item.type}</Text>
            </View>
            <View style={[styles.statusContainer, 
              { backgroundColor: item.status === 'active' ? '#d4edda' : '#f8d7da' }]}>
              <Text style={[styles.statusText, 
                { color: item.status === 'active' ? '#155724' : '#721c24' }]}>
                {item.status}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: textColor }]}>Student Clubs</Text>
        <TouchableOpacity style={styles.createButton}>
          <Ionicons name="add-circle" size={24} color="#4CAF50" />
          <Text style={styles.createButtonText}>New Club</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <FlatList
          data={clubs}
          renderItem={renderClubItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createButtonText: {
    marginLeft: 5,
    color: '#4CAF50',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clubCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clubLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  clubInfo: {
    flex: 1,
  },
  clubName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  clubDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  clubMeta: {
    flexDirection: 'row',
    marginTop: 4,
  },
  tagContainer: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#333',
  },
  statusContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
}); 