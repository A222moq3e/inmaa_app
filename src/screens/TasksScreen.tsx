import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Theme
import { useThemeColor } from '@/hooks/useThemeColor';

// Mock data (replace with actual API calls)
const MOCK_TASKS = [
  {
    id: 1,
    title: 'Website Development',
    description: 'Develop club website with user registration and event management',
    volunteeredSeconds: 7200, // 2 hours
    category: 'club_programs_projects',
    status: 'pending',
    attachment: 'https://example.com/attachment.pdf',
    reviewComment: null,
    createdAt: '2024-05-10T09:00:00Z',
    updatedAt: '2024-05-10T09:00:00Z'
  },
  {
    id: 2,
    title: 'Chess Tournament Organization',
    description: 'Plan and organize the annual chess tournament including registration and logistics',
    volunteeredSeconds: 14400, // 4 hours
    category: 'club_initiatives',
    status: 'accepted',
    attachment: 'https://example.com/chess-plan.pdf',
    reviewComment: 'Great work! Well organized plan.',
    createdAt: '2024-05-08T10:30:00Z',
    updatedAt: '2024-05-09T14:15:00Z'
  },
  {
    id: 3,
    title: 'Art Exhibition Setup',
    description: 'Help with setting up the art exhibition including hanging artwork and arranging gallery space',
    volunteeredSeconds: 10800, // 3 hours
    category: 'club_activities',
    status: 'pending',
    attachment: null,
    reviewComment: null,
    createdAt: '2024-05-11T15:45:00Z',
    updatedAt: '2024-05-11T15:45:00Z'
  }
];

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

export default function TasksScreen() {
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [loading, setLoading] = useState(false);
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const navigation = useNavigation();

  // Fetch tasks from API (replace mock implementation)
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        // const response = await fetch('https://api.example.com/tasks');
        // const data = await response.json();
        // setTasks(data.data.tasks);
        
        // Using mock data for now
        setTimeout(() => {
          setTasks(MOCK_TASKS);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Format seconds to hours and minutes
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}m`;
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderTaskItem = ({ item }) => {
    const statusStyle = STATUS_COLORS[item.status] || STATUS_COLORS.pending;
    
    return (
      <TouchableOpacity 
        style={[styles.taskCard, { backgroundColor: useThemeColor({}, 'card') }]}
        onPress={() => navigation.navigate('TaskDetails', { taskId: item.id })}
      >
        <View style={styles.taskHeader}>
          <Text style={[styles.taskTitle, { color: textColor }]}>{item.title}</Text>
          <View style={[styles.statusContainer, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {item.status.replace('_', ' ')}
            </Text>
          </View>
        </View>
        
        <Text style={[styles.taskDescription, { color: textColor }]} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.taskMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.metaText}>{formatTime(item.volunteeredSeconds)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="folder-outline" size={16} color="#666" />
            <Text style={styles.metaText}>{CATEGORY_DISPLAY[item.category] || item.category}</Text>
          </View>
        </View>
        
        <View style={styles.taskFooter}>
          <Text style={styles.dateText}>Submitted: {formatDate(item.createdAt)}</Text>
          {item.attachment && (
            <View style={styles.attachmentContainer}>
              <Ionicons name="attach" size={16} color="#666" />
              <Text style={styles.attachmentText}>Attachment</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: textColor }]}>Tasks</Text>
        <TouchableOpacity style={styles.createButton}>
          <Ionicons name="add-circle" size={24} color="#4CAF50" />
          <Text style={styles.createButtonText}>New Task</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderTaskItem}
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
  taskCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  statusContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  taskDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 12,
  },
  taskMeta: {
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
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    paddingTop: 8,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  attachmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachmentText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
}); 