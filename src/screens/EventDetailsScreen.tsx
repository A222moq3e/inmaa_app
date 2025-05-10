import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

// Theme
import { useThemeColor } from '@/hooks/useThemeColor';

// Mock data
const MOCK_EVENT = {
  id: 1,
  title: 'Web Development Workshop',
  description: 'Learn the fundamentals of web development with HTML, CSS, and JavaScript. This hands-on workshop is perfect for beginners who want to start their journey in web development. We will cover basic concepts, best practices, and help you build your first webpage.',
  startDate: '2024-06-15T10:00:00Z',
  endDate: '2024-06-15T14:00:00Z',
  location: 'Computer Lab Building A, Room 302',
  image: 'https://via.placeholder.com/600x300',
  organizer: {
    id: 1,
    name: 'Programming Club'
  },
  status: 'upcoming',
  registrationStatus: 'open',
  capacity: 30,
  registeredCount: 18,
  requirements: 'Bring your laptop with any operating system. No prior coding experience required.',
  instructors: [
    {
      id: 1,
      name: 'Dr. John Smith',
      role: 'Associate Professor'
    }
  ]
};

export default function EventDetailsScreen() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const navigation = useNavigation();
  const route = useRoute();
  const { eventId } = route.params || { eventId: 1 };

  // Fetch event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        // const response = await fetch(`https://api.example.com/events/${eventId}`);
        // const data = await response.json();
        // setEvent(data.data);
        
        // Check if user is registered
        // const registrationResponse = await fetch(`https://api.example.com/events/${eventId}/registration`);
        // const registrationData = await registrationResponse.json();
        // setIsRegistered(registrationData.data.isRegistered);
        
        // Using mock data for now
        setTimeout(() => {
          setEvent(MOCK_EVENT);
          setIsRegistered(Math.random() > 0.7); // randomly set for demo
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching event details:', error);
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
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

  // Calculate available spots
  const availableSpots = event ? event.capacity - event.registeredCount : 0;

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor }]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#dc3545" />
          <Text style={[styles.errorText, { color: textColor }]}>
            Event not found or error loading data
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
      
      <Image source={{ uri: event.image }} style={styles.eventImage} />
      
      <View style={styles.contentContainer}>
        <Text style={[styles.eventTitle, { color: textColor }]}>{event.title}</Text>
        
        <View style={styles.organizerRow}>
          <Text style={styles.organizerLabel}>Organized by:</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('ClubDetails', { clubId: event.organizer.id })}
          >
            <Text style={styles.organizerName}>{event.organizer.name}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.metaText}>{formatDate(event.startDate)}</Text>
          </View>
          
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <Text style={styles.metaText}>{formatTime(event.startDate)} - {formatTime(event.endDate)}</Text>
          </View>
          
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={styles.metaText}>{event.location}</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>About This Event</Text>
          <Text style={[styles.description, { color: textColor }]}>{event.description}</Text>
        </View>
        
        {event.requirements && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Requirements</Text>
            <Text style={[styles.description, { color: textColor }]}>{event.requirements}</Text>
          </View>
        )}
        
        {event.instructors && event.instructors.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Instructor(s)</Text>
            {event.instructors.map(instructor => (
              <View key={instructor.id} style={styles.instructorItem}>
                <Text style={[styles.instructorName, { color: textColor }]}>{instructor.name}</Text>
                <Text style={styles.instructorRole}>{instructor.role}</Text>
              </View>
            ))}
          </View>
        )}
        
        <View style={styles.registrationContainer}>
          <View style={styles.capacityContainer}>
            <Text style={styles.capacityText}>
              {availableSpots} spots left out of {event.capacity}
            </Text>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  {width: `${(event.registeredCount / event.capacity) * 100}%`}
                ]} 
              />
            </View>
          </View>
          
          {event.registrationStatus === 'open' ? (
            isRegistered ? (
              <TouchableOpacity style={[styles.actionButton, styles.cancelButton]}>
                <Text style={styles.cancelButtonText}>Cancel Registration</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[styles.actionButton, styles.registerButton]}>
                <Text style={styles.registerButtonText}>Register Now</Text>
              </TouchableOpacity>
            )
          ) : (
            <View style={[styles.actionButton, styles.closedButton]}>
              <Text style={styles.closedButtonText}>Registration Closed</Text>
            </View>
          )}
        </View>
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
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 10,
  },
  backButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventImage: {
    width: '100%',
    height: 250,
  },
  contentContainer: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  organizerLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  organizerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007bff',
  },
  metaContainer: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    paddingBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  instructorItem: {
    marginBottom: 8,
  },
  instructorName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  instructorRole: {
    fontSize: 14,
    color: '#666',
  },
  registrationContainer: {
    marginTop: 8,
    marginBottom: 32,
  },
  capacityContainer: {
    marginBottom: 16,
  },
  capacityText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007bff',
  },
  actionButton: {
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
  },
  registerButton: {
    backgroundColor: '#007bff',
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  cancelButtonText: {
    color: '#dc3545',
    fontWeight: '600',
    fontSize: 16,
  },
  closedButton: {
    backgroundColor: '#e0e0e0',
  },
  closedButtonText: {
    color: '#666',
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