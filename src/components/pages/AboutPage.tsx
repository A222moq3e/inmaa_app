import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';

export function AboutPage() {
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="information-circle" size={60} color={primaryColor} />
        <Text style={[styles.title, { color: textColor }]}>About Our App</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: primaryColor }]}>Our Mission</Text>
        <Text style={[styles.paragraph, { color: textColor }]}>
          Our mission is to provide a simple, intuitive navigation experience for mobile applications.
          We believe in creating clean, accessible interfaces that make it easy for users to find what they need.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: primaryColor }]}>Features</Text>
        <View style={styles.featureItem}>
          <Ionicons name="checkmark-circle" size={24} color={secondaryColor} style={styles.icon} />
          <Text style={[styles.featureText, { color: textColor }]}>Intuitive navigation system</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="checkmark-circle" size={24} color={secondaryColor} style={styles.icon} />
          <Text style={[styles.featureText, { color: textColor }]}>Customizable drawer menu</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="checkmark-circle" size={24} color={secondaryColor} style={styles.icon} />
          <Text style={[styles.featureText, { color: textColor }]}>Beautiful animations</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="checkmark-circle" size={24} color={secondaryColor} style={styles.icon} />
          <Text style={[styles.featureText, { color: textColor }]}>Responsive design</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: primaryColor }]}>Version</Text>
        <Text style={[styles.paragraph, { color: textColor }]}>Current Version: 1.0.0</Text>
        <Text style={[styles.paragraph, { color: textColor }]}>
          Last Updated: June 2023
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: primaryColor }]}>Contact Us</Text>
        <Text style={[styles.paragraph, { color: textColor }]}>
          Have questions or feedback? Contact our support team at:
        </Text>
        <Text style={[styles.contactInfo, { color: secondaryColor }]}>
          support@example.com
        </Text>
        <Text style={[styles.contactInfo, { color: secondaryColor }]}>
          +1 (555) 123-4567
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    marginRight: 10,
  },
  featureText: {
    fontSize: 16,
  },
  contactInfo: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 6,
  },
}); 