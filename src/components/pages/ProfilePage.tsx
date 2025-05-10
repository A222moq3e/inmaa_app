import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';

export function ProfilePage() {
  const backgroundColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  
  const [editing, setEditing] = useState(false);
  const [userName, setUserName] = useState('John Doe');
  const [userEmail, setUserEmail] = useState('john.doe@example.com');
  const [userPhone, setUserPhone] = useState('+1 (555) 987-6543');
  const [userBio, setUserBio] = useState('Software developer passionate about creating intuitive mobile applications.');

  const toggleEditing = () => {
    setEditing(!editing);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image 
            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
            style={styles.profileImage} 
          />
          <View style={[styles.statusIndicator, { backgroundColor: '#4CAF50' }]} />
        </View>
        
        {editing ? (
          <TextInput
            style={[styles.nameInput, { color: textColor, borderColor: primaryColor }]}
            value={userName}
            onChangeText={setUserName}
            autoFocus
          />
        ) : (
          <Text style={[styles.userName, { color: textColor }]}>{userName}</Text>
        )}
        
        <TouchableOpacity style={[styles.editButton, { backgroundColor: primaryColor }]} onPress={toggleEditing}>
          <Ionicons name={editing ? "checkmark" : "pencil"} size={20} color="#fff" />
          <Text style={styles.editButtonText}>{editing ? "Save" : "Edit Profile"}</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.section, { backgroundColor }]}>
        <Text style={[styles.sectionTitle, { color: primaryColor }]}>Personal Information</Text>
        
        <View style={styles.infoRow}>
          <Ionicons name="mail" size={22} color={secondaryColor} style={styles.infoIcon} />
          <Text style={[styles.infoLabel, { color: textColor }]}>Email:</Text>
          {editing ? (
            <TextInput
              style={[styles.infoInput, { color: textColor, borderColor: secondaryColor }]}
              value={userEmail}
              onChangeText={setUserEmail}
            />
          ) : (
            <Text style={[styles.infoValue, { color: textColor }]}>{userEmail}</Text>
          )}
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="call" size={22} color={secondaryColor} style={styles.infoIcon} />
          <Text style={[styles.infoLabel, { color: textColor }]}>Phone:</Text>
          {editing ? (
            <TextInput
              style={[styles.infoInput, { color: textColor, borderColor: secondaryColor }]}
              value={userPhone}
              onChangeText={setUserPhone}
            />
          ) : (
            <Text style={[styles.infoValue, { color: textColor }]}>{userPhone}</Text>
          )}
        </View>
      </View>

      <View style={[styles.section, { backgroundColor }]}>
        <Text style={[styles.sectionTitle, { color: primaryColor }]}>About Me</Text>
        {editing ? (
          <TextInput
            style={[styles.bioInput, { color: textColor, borderColor: secondaryColor }]}
            value={userBio}
            onChangeText={setUserBio}
            multiline
            numberOfLines={4}
          />
        ) : (
          <Text style={[styles.bioText, { color: textColor }]}>{userBio}</Text>
        )}
      </View>

      <View style={[styles.section, { backgroundColor }]}>
        <Text style={[styles.sectionTitle, { color: primaryColor }]}>Account Statistics</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: secondaryColor }]}>24</Text>
            <Text style={[styles.statLabel, { color: textColor }]}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: secondaryColor }]}>142</Text>
            <Text style={[styles.statLabel, { color: textColor }]}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: secondaryColor }]}>86</Text>
            <Text style={[styles.statLabel, { color: textColor }]}>Following</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: 'white',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  nameInput: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottomWidth: 1,
    textAlign: 'center',
    paddingHorizontal: 5,
    paddingVertical: 2,
    minWidth: 200,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    borderRadius: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 10,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    width: 60,
  },
  infoValue: {
    fontSize: 16,
    flex: 1,
  },
  infoInput: {
    fontSize: 16,
    flex: 1,
    borderBottomWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
  },
  bioInput: {
    fontSize: 16,
    lineHeight: 24,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    textAlignVertical: 'top',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 5,
  },
}); 