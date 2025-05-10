import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Theme
import { useThemeColor } from '@/hooks/useThemeColor';

// Mock data (replace with actual API calls)
const MOCK_EVENTS = [
  {
    id: 1,
    title: 'Web Development Workshop',
    description: 'Learn the fundamentals of web development with HTML, CSS, and JavaScript',
    startDate: '2024-06-15T10:00:00Z',
    endDate: '2024-06-15T14:00:00Z',
    location: 'Computer Lab Building A',
    image: 'https://via.placeholder.com/300',
    organizer: {
      id: 1,
      name: 'Programming Club'
    },
    status: 'upcoming',
    registrationStatus: 'open'
  },
  {
    id: 2,
    title: 'Chess Tournament',
    description: 'Annual chess tournament open for all student levels',
    startDate: '2024-06-20T09:00:00Z',
    endDate: '2024-06-20T18:00:00Z',
    location: 'Student Center',
    image: 'https://via.placeholder.com/300',
    organizer: {
      id: 2,
      name: 'Chess Club'
    },
    status: 'upcoming',
    registrationStatus: 'open'
  },
  {
    id: 3,
    title: 'Art Exhibition',
    description: 'Student art showcase featuring various mediums and styles',
    startDate: '2024-07-05T13:00:00Z',
    endDate: '2024-07-07T19:00:00Z',
    location: 'Art Gallery',
    image: 'https://via.placeholder.com/300',
    organizer: {
      id: 3,
      name: 'Art Club'
    },
    status: 'upcoming',
    registrationStatus: 'open'
  }
];

export default function EventsScreen() {
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [loading, setLoading] = useState(false);
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const navigation = useNavigation();

  // Fetch events from API (replace mock implementation)
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        // const response = await fetch('https://api.example.com/events');
        // const data = await response.json();
        // setEvents(data.data.events);
        
        // Using mock data for now
        setTimeout(() => {
          setEvents(MOCK_EVENTS);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };

    fetchEvents();
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

  // Format time for display
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const renderEventItem = ({ item }) => {
    const startDateStr = formatDate(item.startDate);
    const startTimeStr = formatTime(item.startDate);
    const endTimeStr = formatTime(item.endDate);
    
    return (
      <TouchableOpacity 
        style={[styles.eventCard, { backgroundColor: useThemeColor({}, 'card') }]}
        onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
      >
        <Image source={{ uri: item.image }} style={styles.eventImage} />
        <View style={styles.eventInfo}>
          <Text style={[styles.eventTitle, { color: textColor }]}>{item.title}</Text>
          <Text style={[styles.eventDescription, { color: textColor }]} numberOfLines={2}>
            {item.description}
          </Text>
          
          <View style={styles.eventMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar" size={16} color="#666" />
              <Text style={styles.metaText}>{startDateStr}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time" size={16} color="#666" />
              <Text style={styles.metaText}>{startTimeStr} - {endTimeStr}</Text>
            </View>
          </View>
          
          <View style={styles.eventFooter}>
            <View style={styles.organizerContainer}>
              <Text style={styles.organizerText}>By {item.organizer.name}</Text>
            </View>
            <View style={[styles.statusContainer, 
              { backgroundColor: item.registrationStatus === 'open' ? '#d4edda' : '#f8d7da' }]}>
              <Text style={[styles.statusText, 
                { color: item.registrationStatus === 'open' ? '#155724' : '#721c24' }]}>
                {item.registrationStatus}
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
        <Text style={[styles.headerTitle, { color: textColor }]}>Events</Text>
        <TouchableOpacity style={styles.createButton}>
          <Ionicons name="add-circle" size={24} color="#4CAF50" />
          <Text style={styles.createButtonText}>New Event</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <FlatList
          data={events}
          renderItem={renderEventItem}
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
  eventCard: {
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 150,
  },
  eventInfo: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 12,
  },
  eventMeta: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  organizerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  organizerText: {
    fontSize: 12,
    color: '#666',
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