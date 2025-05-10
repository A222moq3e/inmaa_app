import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

// Theme
import { useThemeColor } from '@/hooks/useThemeColor';

// Mock data (replace with actual API calls)
const MOCK_CLUB = {
  id: 1,
  name: 'Programming Club',
  description: 'A club dedicated to programming enthusiasts and those interested in learning coding skills. We organize workshops, hackathons, and coding competitions throughout the academic year. Members get access to exclusive resources, mentorship opportunities, and networking events with industry professionals.',
  logo: 'https://via.placeholder.com/300',
  type: 'specialized',
  status: 'active',
  foundingDate: '2023-09-15T00:00:00Z',
  supervisor: {
    id: 10,
    name: 'Dr. Jane Smith',
    title: 'Associate Professor'
  },
  members: [
    { id: 1, displayName: 'John Doe', role: 'president' },
    { id: 2, displayName: 'Alice Johnson', role: 'vice_president' },
    { id: 3, displayName: 'Bob Wilson', role: 'member' },
    { id: 4, displayName: 'Carol Taylor', role: 'member' }
  ],
  upcomingEvents: [
    {
      id: 1,
      title: 'Web Development Workshop',
      startDate: '2024-06-15T10:00:00Z'
    },
    {
      id: 2,
      title: 'Hackathon',
      startDate: '2024-06-30T09:00:00Z'
    }
  ]
};

export default function ClubDetailsScreen() {
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const navigation = useNavigation();
  const route = useRoute();
  const { clubId } = route.params || { clubId: 1 };

  // Fetch club details from API (replace mock implementation)
  useEffect(() => {
    const fetchClubDetails = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        // const response = await fetch(`https://api.example.com/clubs/${clubId}`);
        // const data = await response.json();
        // setClub(data.data);
        
        // Check if user is member
        // const membershipResponse = await fetch(`https://api.example.com/memberships?clubId=${clubId}`);
        // const membershipData = await membershipResponse.json();
        // setIsMember(membershipData.data.length > 0);
        
        // Using mock data for now
        setTimeout(() => {
          setClub(MOCK_CLUB);
          setIsMember(Math.random() > 0.5); // randomly set for demo
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching club details:', error);
        setLoading(false);
      }
    };

    fetchClubDetails();
  }, [clubId]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format event date
  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor }]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!club) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#dc3545" />
          <Text style={[styles.errorText, { color: textColor }]}>
            Club not found or error loading data
          </Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButtonContainer}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.clubHeader}>
        <Image source={{ uri: club.logo }} style={styles.logo} />
        <Text style={[styles.clubName, { color: textColor }]}>{club.name}</Text>
        <View style={[styles.typeContainer, { backgroundColor: '#e0e0e0' }]}>
          <Text style={styles.typeText}>{club.type}</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>About</Text>
        <Text style={[styles.description, { color: textColor }]}>{club.description}</Text>
        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={16} color="#666" />
          <Text style={styles.infoText}>Founded {formatDate(club.foundingDate)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="person" size={16} color="#666" />
          <Text style={styles.infoText}>Supervisor: {club.supervisor.name}, {club.supervisor.title}</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Members</Text>
        <View style={styles.membersContainer}>
          {club.members.slice(0, 4).map((member) => (
            <View key={member.id} style={styles.memberItem}>
              <View style={styles.memberAvatar}>
                <Text style={styles.memberInitial}>
                  {member.displayName.charAt(0)}
                </Text>
              </View>
              <Text style={styles.memberName}>{member.displayName}</Text>
              <Text style={styles.memberRole}>
                {member.role.replace('_', ' ')}
              </Text>
            </View>
          ))}
          {club.members.length > 4 && (
            <TouchableOpacity style={styles.viewMoreButton}>
              <Text style={styles.viewMoreText}>View All</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {club.upcomingEvents.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Upcoming Events</Text>
          {club.upcomingEvents.map((event) => (
            <TouchableOpacity 
              key={event.id} 
              style={styles.eventItem}
              onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
            >
              <View style={styles.eventDate}>
                <Text style={styles.eventDateText}>{formatEventDate(event.startDate)}</Text>
              </View>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      <View style={styles.actionsContainer}>
        {isMember ? (
          <TouchableOpacity style={[styles.actionButton, styles.leaveButton]}>
            <Text style={styles.leaveButtonText}>Leave Club</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.actionButton, styles.joinButton]}>
            <Text style={styles.joinButtonText}>Join Club</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  backButtonContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clubHeader: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  clubName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  typeContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 8,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  section: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  membersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  memberItem: {
    width: '48%',
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6c757d',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  memberInitial: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  viewMoreButton: {
    width: '100%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  viewMoreText: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '500',
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  eventDate: {
    marginRight: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  eventDateText: {
    fontSize: 12,
    fontWeight: '500',
  },
  eventTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  actionsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  actionButton: {
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
  },
  joinButton: {
    backgroundColor: '#007bff',
  },
  joinButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  leaveButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  leaveButtonText: {
    color: '#dc3545',
    fontWeight: '600',
    fontSize: 16,
  },
  backButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
  }
}); 