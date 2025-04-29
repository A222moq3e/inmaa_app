import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';

// Sample notification data
const notifications = [
  {
    id: '1',
    type: 'message',
    title: 'New Message',
    content: 'You have received a new message from Sarah.',
    time: '2 minutes ago',
    read: false,
  },
  {
    id: '2',
    type: 'friend',
    title: 'Friend Request',
    content: 'Michael sent you a friend request.',
    time: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    type: 'like',
    title: 'New Like',
    content: 'Emily liked your recent post.',
    time: '3 hours ago',
    read: true,
  },
  {
    id: '4',
    type: 'comment',
    title: 'New Comment',
    content: 'David commented on your photo.',
    time: 'Yesterday',
    read: true,
  },
  {
    id: '5',
    type: 'system',
    title: 'System Update',
    content: 'The app has been updated to version 2.1.',
    time: '2 days ago',
    read: true,
  },
  {
    id: '6',
    type: 'message',
    title: 'New Message',
    content: 'You have received a new message from John.',
    time: '3 days ago',
    read: true,
  },
  {
    id: '7',
    type: 'event',
    title: 'Event Reminder',
    content: 'Your scheduled event starts in 1 hour.',
    time: '4 days ago',
    read: true,
  },
];

export function NotificationsPage() {
  const backgroundColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');

  // Get the icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <Ionicons name="chatbubble" size={24} color="#3498db" />;
      case 'friend':
        return <Ionicons name="person-add" size={24} color="#2ecc71" />;
      case 'like':
        return <Ionicons name="heart" size={24} color="#e74c3c" />;
      case 'comment':
        return <Ionicons name="chatbubble-ellipses" size={24} color="#9b59b6" />;
      case 'system':
        return <Ionicons name="information-circle" size={24} color="#f39c12" />;
      case 'event':
        return <Ionicons name="calendar" size={24} color="#1abc9c" />;
      default:
        return <Ionicons name="notifications" size={24} color={secondaryColor} />;
    }
  };

  const renderNotificationItem = ({ item }: { item: typeof notifications[0] }) => (
    <TouchableOpacity 
      style={[
        styles.notificationItem, 
        { backgroundColor: item.read ? backgroundColor : 'rgba(52, 152, 219, 0.1)' }
      ]}
    >
      <View style={styles.iconContainer}>
        {getNotificationIcon(item.type)}
      </View>
      <View style={styles.contentContainer}>
        <Text style={[styles.notificationTitle, { color: textColor }]}>{item.title}</Text>
        <Text style={[styles.notificationContent, { color: textColor }]}>{item.content}</Text>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
      {!item.read && (
        <View style={[styles.unreadDot, { backgroundColor: primaryColor }]} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Notifications</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options" size={22} color={textColor} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <Text style={[styles.statsText, { color: textColor }]}>
          You have <Text style={{ color: primaryColor, fontWeight: 'bold' }}>2 unread</Text> notifications
        </Text>
        <TouchableOpacity>
          <Text style={[styles.markAllText, { color: primaryColor }]}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  filterButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  statsText: {
    fontSize: 14,
  },
  markAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notificationContent: {
    fontSize: 14,
    marginBottom: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#888',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 8,
  },
}); 