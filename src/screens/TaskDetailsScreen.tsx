import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

// Theme
import { useThemeColor } from '@/hooks/useThemeColor';

// Mock data
const MOCK_TASK = {
  id: 1,
  title: 'Website Development',
  description: 'Develop club website with user registration and event management capabilities. The website should be responsive and include features for club members to sign up for events, track volunteering hours, and access club resources. Additional features may include a blog section, photo gallery, and member directory.',
  volunteeredSeconds: 7200, // 2 hours
  category: 'club_programs_projects',
  status: 'pending',
  attachment: 'https://example.com/attachment.pdf',
  reviewComment: null,
  createdAt: '2024-05-10T09:00:00Z',
  updatedAt: '2024-05-10T09:00:00Z',
  submittedBy: {
    id: 1,
    displayName: 'John Doe'
  },
  club: {
    id: 1,
    name: 'Programming Club'
  }
};

// Task category display mapping
const CATEGORY_DISPLAY = {
  'club_programs_projects': 'Club Programs & Projects',
  'club_initiatives': 'Club Initiatives',
  'club_activities': 'Club Activities',
  'social_community_service': 'Social & Community Service',
  'leadership_management': 'Leadership & Management'
};

// Status color mapping
const STATUS_COLORS = {
  'pending': {
    bg: '#fff3cd',
    text: '#856404'
  },
  'accepted': {
    bg: '#d4edda',
    text: '#155724'
  },
  'changes_requested': {
    bg: '#cce5ff',
    text: '#004085'
  },
  'denied': {
    bg: '#f8d7da',
    text: '#721c24'
  }
};

export default function TaskDetailsScreen() {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const navigation = useNavigation();
  const route = useRoute();
  const { taskId } = route.params || { taskId: 1 };

  // Fetch task details
  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        // const response = await fetch(`https://api.example.com/tasks/${taskId}`);
        // const data = await response.json();
        // setTask(data.data);
        
        // Using mock data for now
        setTimeout(() => {
          setTask(MOCK_TASK);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching task details:', error);
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  // Format seconds to hours and minutes
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0 && minutes > 0) {
      return `${hours} hours ${minutes} minutes`;
    } else if (hours > 0) {
      return hours === 1 ? `${hours} hour` : `${hours} hours`;
    } else {
      return minutes === 1 ? `${minutes} minute` : `${minutes} minutes`;
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Open attachment
  const openAttachment = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error("Cannot open URL: " + url);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor }]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#dc3545" />
          <Text style={[styles.errorText, { color: textColor }]}>
            Task not found or error loading data
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

  const statusStyle = STATUS_COLORS[task.status] || STATUS_COLORS.pending;

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
      
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={[styles.taskTitle, { color: textColor }]}>{task.title}</Text>
          <View style={[styles.statusContainer, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {task.status.replace('_', ' ')}
            </Text>
          </View>
        </View>
        
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <Text style={styles.metaText}>{formatTime(task.volunteeredSeconds)}</Text>
          </View>
          
          <View style={styles.metaItem}>
            <Ionicons name="folder-outline" size={20} color="#666" />
            <Text style={styles.metaText}>{CATEGORY_DISPLAY[task.category] || task.category}</Text>
          </View>
          
          <View style={styles.metaItem}>
            <Ionicons name="person-outline" size={20} color="#666" />
            <Text style={styles.metaText}>Submitted by {task.submittedBy.displayName}</Text>
          </View>
          
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.metaText}>Submitted on {formatDate(task.createdAt)}</Text>
          </View>
          
          <View style={styles.metaItem}>
            <Ionicons name="business-outline" size={20} color="#666" />
            <TouchableOpacity onPress={() => navigation.navigate('ClubDetails', { clubId: task.club.id })}>
              <Text style={styles.clubText}>{task.club.name}</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Description</Text>
          <Text style={[styles.description, { color: textColor }]}>{task.description}</Text>
        </View>
        
        {task.attachment && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Attachment</Text>
            <TouchableOpacity 
              style={styles.attachmentButton}
              onPress={() => openAttachment(task.attachment)}
            >
              <Ionicons name="document-text" size={24} color="#007bff" />
              <Text style={styles.attachmentText}>View Attachment</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {task.reviewComment && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Review Comments</Text>
            <View style={styles.commentContainer}>
              <Text style={styles.commentText}>{task.reviewComment}</Text>
            </View>
          </View>
        )}
        
        {task.status === 'pending' && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={[styles.actionButton, styles.editButton]}>
              <Text style={styles.editButtonText}>Edit Task</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionButton, styles.deleteButton]}>
              <Text style={styles.deleteButtonText}>Delete Task</Text>
            </TouchableOpacity>
          </View>
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
  contentContainer: {
    padding: 16,
  },
  titleContainer: {
    marginBottom: 16,
  },
  taskTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
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
  clubText: {
    fontSize: 14,
    color: '#007bff',
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
  attachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    borderRadius: 8,
  },
  attachmentText: {
    marginLeft: 8,
    color: '#007bff',
    fontWeight: '500',
  },
  commentContainer: {
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#6c757d',
  },
  commentText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#555',
  },
  actionsContainer: {
    marginTop: 8,
    marginBottom: 32,
  },
  actionButton: {
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
    marginBottom: 12,
  },
  editButton: {
    backgroundColor: '#007bff',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  deleteButtonText: {
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