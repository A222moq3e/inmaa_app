import React, { useState } from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';

export function SettingsPage() {
  const backgroundColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  
  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [location, setLocation] = useState(true);
  const [dataSync, setDataSync] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(false);
  
  // Dropdown state
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="settings" size={50} color={primaryColor} />
        <Text style={[styles.title, { color: textColor }]}>Settings</Text>
      </View>

      <View style={[styles.section, { backgroundColor }]}>
        <Text style={[styles.sectionTitle, { color: primaryColor }]}>Preferences</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Ionicons name="notifications" size={24} color={secondaryColor} style={styles.settingIcon} />
            <Text style={[styles.settingLabel, { color: textColor }]}>Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#767577', true: secondaryColor }}
            thumbColor="#f4f3f4"
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Ionicons name="moon" size={24} color={secondaryColor} style={styles.settingIcon} />
            <Text style={[styles.settingLabel, { color: textColor }]}>Dark Mode</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#767577', true: secondaryColor }}
            thumbColor="#f4f3f4"
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Ionicons name="location" size={24} color={secondaryColor} style={styles.settingIcon} />
            <Text style={[styles.settingLabel, { color: textColor }]}>Location Services</Text>
          </View>
          <Switch
            value={location}
            onValueChange={setLocation}
            trackColor={{ false: '#767577', true: secondaryColor }}
            thumbColor="#f4f3f4"
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Ionicons name="sync" size={24} color={secondaryColor} style={styles.settingIcon} />
            <Text style={[styles.settingLabel, { color: textColor }]}>Data Syncing</Text>
          </View>
          <Switch
            value={dataSync}
            onValueChange={setDataSync}
            trackColor={{ false: '#767577', true: secondaryColor }}
            thumbColor="#f4f3f4"
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Ionicons name="refresh-circle" size={24} color={secondaryColor} style={styles.settingIcon} />
            <Text style={[styles.settingLabel, { color: textColor }]}>Auto Updates</Text>
          </View>
          <Switch
            value={autoUpdate}
            onValueChange={setAutoUpdate}
            trackColor={{ false: '#767577', true: secondaryColor }}
            thumbColor="#f4f3f4"
          />
        </View>
      </View>

      <View style={[styles.section, { backgroundColor }]}>
        <Text style={[styles.sectionTitle, { color: primaryColor }]}>Account</Text>
        
        <TouchableOpacity 
          style={styles.dropdownHeader}
          onPress={() => toggleSection('privacy')}
        >
          <View style={styles.settingInfo}>
            <Ionicons name="lock-closed" size={24} color={secondaryColor} style={styles.settingIcon} />
            <Text style={[styles.settingLabel, { color: textColor }]}>Privacy</Text>
          </View>
          <Ionicons 
            name={expandedSection === 'privacy' ? "chevron-up" : "chevron-down"} 
            size={24} 
            color={textColor} 
          />
        </TouchableOpacity>
        
        {expandedSection === 'privacy' && (
          <View style={styles.dropdownContent}>
            <Text style={[styles.dropdownText, { color: textColor }]}>
              Control your privacy settings and manage how your data is used.
            </Text>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: primaryColor }]}>
              <Text style={styles.actionButtonText}>Privacy Settings</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.dropdownHeader}
          onPress={() => toggleSection('security')}
        >
          <View style={styles.settingInfo}>
            <Ionicons name="shield" size={24} color={secondaryColor} style={styles.settingIcon} />
            <Text style={[styles.settingLabel, { color: textColor }]}>Security</Text>
          </View>
          <Ionicons 
            name={expandedSection === 'security' ? "chevron-up" : "chevron-down"} 
            size={24} 
            color={textColor} 
          />
        </TouchableOpacity>
        
        {expandedSection === 'security' && (
          <View style={styles.dropdownContent}>
            <Text style={[styles.dropdownText, { color: textColor }]}>
              Manage your account security settings and password.
            </Text>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: primaryColor }]}>
              <Text style={styles.actionButtonText}>Change Password</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={[styles.section, { backgroundColor }]}>
        <Text style={[styles.sectionTitle, { color: primaryColor }]}>Support</Text>
        
        <TouchableOpacity style={styles.supportRow}>
          <Ionicons name="help-circle" size={24} color={secondaryColor} style={styles.settingIcon} />
          <Text style={[styles.settingLabel, { color: textColor }]}>Help Center</Text>
          <Ionicons name="chevron-forward" size={24} color={textColor} style={styles.forwardIcon} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.supportRow}>
          <Ionicons name="chatbubble-ellipses" size={24} color={secondaryColor} style={styles.settingIcon} />
          <Text style={[styles.settingLabel, { color: textColor }]}>Contact Support</Text>
          <Ionicons name="chevron-forward" size={24} color={textColor} style={styles.forwardIcon} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.supportRow}>
          <Ionicons name="document-text" size={24} color={secondaryColor} style={styles.settingIcon} />
          <Text style={[styles.settingLabel, { color: textColor }]}>Terms of Service</Text>
          <Ionicons name="chevron-forward" size={24} color={textColor} style={styles.forwardIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: '#e74c3c' }]}>
          <Ionicons name="log-out" size={20} color="#fff" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
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
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
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
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  dropdownContent: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 5,
    marginVertical: 10,
  },
  dropdownText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  supportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  forwardIcon: {
    marginLeft: 'auto',
  },
  logoutContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 