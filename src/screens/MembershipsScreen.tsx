import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Theme
import { useThemeColor } from '@/hooks/useThemeColor';

// Mock data (replace with actual API calls)
const MOCK_MEMBERSHIPS = [
  {
    id: 1,
    club: {
      id: 1,
      name: 'Programming Club',
      logo: 'https://via.placeholder.com/150'
    },
    role: 'member',
    joinDate: '2024-01-15T00:00:00Z',
    status: 'active'
  },
  {
    id: 2,
    club: {
      id: 2,
      name: 'Chess Club',
      logo: 'https://via.placeholder.com/150'
    },
    role: 'president',
    joinDate: '2023-10-05T00:00:00Z',
    status: 'active'
  },
  {
    id: 3,
    club: {
      id: 3,
      name: 'Art Club',
      logo: 'https://via.placeholder.com/150'
    },
    role: 'member',
    joinDate: '2024-03-20T00:00:00Z',
    status: 'active'
  }
];

// Role display mapping
const ROLE_DISPLAY = {
  'member': {
    label: 'Member',
    color: '#6c757d',
    icon: 'person'
  },
  'president': {
    label: 'President',
    color: '#28a745',
    icon: 'ribbon'
  },
  'vice_president': {
    label: 'Vice President',
    color: '#17a2b8',
    icon: 'people'
  },
  'secretary': {
    label: 'Secretary',
    color: '#007bff',
    icon: 'document-text'
  },
  'treasurer': {
    label: 'Treasurer',
    color: '#fd7e14',
    icon: 'cash'
  }
};

export default function MembershipsScreen() {
  const [memberships, setMemberships] = useState(MOCK_MEMBERSHIPS);
  const [loading, setLoading] = useState(false);
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const navigation = useNavigation();

  // Fetch memberships from API (replace mock implementation)
  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        // const response = await fetch('https://api.example.com/memberships');
        // const data = await response.json();
        // setMemberships(data.data.memberships);
        
        // Using mock data for now
        setTimeout(() => {
          setMemberships(MOCK_MEMBERSHIPS);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching memberships:', error);
        setLoading(false);
      }
    };

    fetchMemberships();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderMembershipItem = ({ item }) => {
    const roleInfo = ROLE_DISPLAY[item.role] || { 
      label: item.role, 
      color: '#6c757d',
      icon: 'person'
    };
    
    return (
      <TouchableOpacity 
        style={[styles.membershipCard, { backgroundColor: useThemeColor({}, 'card') }]}
        onPress={() => navigation.navigate('ClubDetails', { clubId: item.club.id })}
      >
        <Image source={{ uri: item.club.logo }} style={styles.clubLogo} />
        <View style={styles.membershipInfo}>
          <Text style={[styles.clubName, { color: textColor }]}>{item.club.name}</Text>
          
          <View style={styles.roleContainer}>
            <Ionicons name={roleInfo.icon} size={16} color={roleInfo.color} />
            <Text style={[styles.roleText, { color: roleInfo.color }]}>
              {roleInfo.label}
            </Text>
          </View>
          
          <View style={styles.membershipMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar" size={14} color="#666" />
              <Text style={styles.metaText}>Joined {formatDate(item.joinDate)}</Text>
            </View>
            
            <View style={styles.statusIndicator}>
              <View style={[styles.statusDot, { 
                backgroundColor: item.status === 'active' ? '#28a745' : '#dc3545' 
              }]} />
              <Text style={styles.statusText}>
                {item.status === 'active' ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="people" size={64} color="#ccc" />
        <Text style={styles.emptyStateTitle}>No Memberships Yet</Text>
        <Text style={styles.emptyStateMessage}>
          You haven&apos;t joined any clubs yet. Browse available clubs and join one!
        </Text>
        <TouchableOpacity 
          style={styles.browseClusButton}
          onPress={() => navigation.navigate('clubs')}
        >
          <Text style={styles.browseClubsButtonText}>Browse Clubs</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: textColor }]}>My Memberships</Text>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <FlatList
          data={memberships}
          renderItem={renderMembershipItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
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
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  membershipCard: {
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
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  membershipInfo: {
    flex: 1,
  },
  clubName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  membershipMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: 80,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  browseClusButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  browseClubsButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
}); 