import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  ViewStyle,
  TextStyle,
  ImageStyle,
  I18nManager,
  TouchableOpacity,
  Platform,
  StyleProp,
  Alert,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  getEventByUuid,
  Event,
  EventResponse,
  registerForEvent,
  unregisterFromEvent,
} from '../api/EventDetails';
import { isAuthenticated } from '../api/auth';

// Enable RTL layout
I18nManager.forceRTL(true);

// Get screen width
const screenWidth = Dimensions.get('window').width;

// Inline style objects that mimic Tailwind/NativeWind classes
const tw = {
  container: { flex: 1, backgroundColor: '#fff' } as ViewStyle,
  header: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  } as ViewStyle,
  eventImage: {
    width: screenWidth,
    height: 200,
    marginBottom: 15,
  } as ImageStyle,
  eventInfoContainer: {
    padding: 20,
  } as ViewStyle,
  name: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    marginBottom: 10,
    textAlign: 'right',
  } as TextStyle,
  badgeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
  } as ViewStyle,
  badge: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginHorizontal: 5,
  } as ViewStyle,
  statusBadge: { backgroundColor: '#4CAF50' } as ViewStyle,
  badgeText: {
    color: '#fff',
    fontWeight: '600' as const,
    fontSize: 12,
    textAlign: 'center',
  } as TextStyle,
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  } as ViewStyle,
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    marginBottom: 10,
    color: '#333',
    textAlign: 'right',
  } as TextStyle,
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    textAlign: 'right',
  } as TextStyle,
  detailRow: {
    flexDirection: 'row-reverse',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  } as ViewStyle,
  detailLabel: {
    flex: 1,
    fontSize: 16,
    color: '#666',
    textAlign: 'right',
  } as TextStyle,
  detailValue: {
    flex: 2,
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
  } as TextStyle,
  error: {
    color: 'red',
    textAlign: 'center',
    padding: 20,
    fontFamily: 'Arial',
    fontSize: 16,
  } as TextStyle,
  loading: {
    textAlign: 'center',
    padding: 20,
    fontFamily: 'Arial',
    fontSize: 16,
  } as TextStyle,
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold' as const,
    textAlign: 'center',
  } as TextStyle,
  seatsInfo: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  } as ViewStyle,
  seatsText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  } as TextStyle,
  statusBox: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  } as ViewStyle,
  statusText: {
    fontSize: 14,
    textAlign: 'center',
  } as TextStyle,
  // New styles
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingBottom: Platform.OS === 'ios' ? 30 : 15,
    zIndex: 10,
  } as ViewStyle,
  floatingButton: {
    backgroundColor: '#3498db',
    paddingVertical: 14,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  } as ViewStyle,
  registerButton: {
    backgroundColor: '#3498db',
  } as ViewStyle,
  unregisterButton: {
    backgroundColor: '#e74c3c',
  } as ViewStyle,
  buttonDisabled: {
    backgroundColor: '#bdc3c7',
  } as ViewStyle,
  registerSection: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginTop: 15,
    marginHorizontal: 20,
  } as ViewStyle,
  spacer: {
    height: 80,
  } as ViewStyle,
};

export default function EventDetailsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ uuid: string }>();
  const eventUuid = params.uuid;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isEventAdmin, setIsEventAdmin] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      setIsUserAuthenticated(authenticated);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventUuid) {
        setError(t('event.not_found'));
        setLoading(false);
        return;
      }

      try {
        const response = await getEventByUuid(eventUuid);

        // Handle nested response structure
        if (response.data && response.data.event) {
          setEvent(response.data.event);
          // Check if user is registered based on registered users array
          const isUserRegistered =
            response.data.registeredUsersData &&
            response.data.registeredUsersData.length > 0;
          setIsRegistered(isUserRegistered);
          setIsEventAdmin(false); // Update based on actual admin status logic
        } else if (response.event) {
          // Handle direct response format
          setEvent(response.event);
          setIsRegistered(response.isRegistered || false);
          setIsEventAdmin(response.isEventAdmin || false);
        } else {
          throw new Error(t('event.not_found'));
        }

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('errors.generic'));
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventUuid, t]);

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      // Use a simpler date format (YYYY-MM-DD HH:MM)
      const date = new Date(dateString);
      return date.toLocaleString('ar', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      });
    } catch (error) {
      return dateString;
    }
  };

  const handleRegistration = async () => {
    if (!event || isRegistering || !eventUuid) return;

    if (!isUserAuthenticated) {
      Alert.alert(
        t('login.required_title') || 'Login Required',
        t('login.required_message') ||
          'Please login to register for this event',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsRegistering(true);
    try {
      if (isRegistered) {
        await unregisterFromEvent(eventUuid);
        setIsRegistered(false);
      } else {
        await registerForEvent(eventUuid);
        setIsRegistered(true);
      }
      setError(null);
    } catch (err) {
      // Show user-friendly error message
      const errorMessage =
        err instanceof Error ? err.message : t('errors.generic');
      Alert.alert(
        t('errors.registration_failed') || 'Registration Failed',
        errorMessage,
        [{ text: 'OK' }]
      );

      setError(errorMessage);
    } finally {
      setIsRegistering(false);
    }
  };

  // Check if registration is currently open
  const isRegistrationOpen = (event: Event) => {
    const now = new Date();
    const start = new Date(event.registrationStart);
    const end = new Date(event.registrationEnd);
    return now >= start && now <= end;
  };

  // Check if event has already happened
  const isEventPast = (event: Event) => {
    const now = new Date();
    const eventEnd = new Date(event.eventEnd);
    return now > eventEnd;
  };

  if (loading) {
    return <Text style={tw.loading}>{t('loading')}</Text>;
  }

  if (error) {
    return <Text style={tw.error}>{error}</Text>;
  }

  if (!event) {
    return <Text style={tw.error}>{t('event.not_found')}</Text>;
  }

  // Determine if registration button should be disabled
  const isRegistrationDisabled =
    !isRegistrationOpen(event) ||
    isEventPast(event) ||
    (event.seatsAvailable <= 0 && !isRegistered);

  const getRegistrationButtonColor = (): ViewStyle => {
    if (isRegistrationDisabled) {
      return tw.buttonDisabled;
    }
    return isRegistered ? tw.unregisterButton : tw.registerButton;
  };

  return (
    <SafeAreaView style={tw.container}>
      <StatusBar style="auto" />
      <ScrollView>
        <View style={tw.header}>
          <Image
            source={
              event.image
                ? { uri: event.image }
                : require('../assets/imgs/event-default.png')
            }
            style={tw.eventImage}
            defaultSource={require('../assets/imgs/event-default.png')}
            resizeMode="cover"
          />
          <View style={tw.eventInfoContainer}>
            <Text style={tw.name}>{event.name}</Text>
            <View style={tw.badgeContainer}>
              <View
                style={[
                  tw.badge,
                  isEventPast(event)
                    ? ({ backgroundColor: '#7f8c8d' } as ViewStyle)
                    : tw.statusBadge,
                ]}
              >
                <Text style={tw.badgeText}>
                  {isEventPast(event) ? t('event.past') : t('event.upcoming')}
                </Text>
              </View>
            </View>

            {/* Seats information */}
            <View style={tw.seatsInfo}>
              <Text style={tw.seatsText}>
                {t('event.seats_available')}: {event.seatsAvailable}
              </Text>
            </View>
          </View>
        </View>

        <View style={tw.section}>
          <Text style={tw.sectionTitle}>{t('event.about')}</Text>
          <Text style={tw.description}>{event.description}</Text>
        </View>

        <View style={tw.section}>
          <Text style={tw.sectionTitle}>{t('event.details')}</Text>
          <View style={tw.detailRow}>
            <Text style={tw.detailLabel}>{t('event.start_date')}:</Text>
            <Text style={tw.detailValue}>{formatDate(event.eventStart)}</Text>
          </View>
          <View style={tw.detailRow}>
            <Text style={tw.detailLabel}>{t('event.end_date')}:</Text>
            <Text style={tw.detailValue}>{formatDate(event.eventEnd)}</Text>
          </View>
          <View style={tw.detailRow}>
            <Text style={tw.detailLabel}>
              {t('event.registration_period')}:
            </Text>
            <Text style={tw.detailValue}>
              {formatDate(event.registrationStart)} -{' '}
              {formatDate(event.registrationEnd)}
            </Text>
          </View>

          {/* Registration status message */}
          {isRegistrationOpen(event) && (
            <View
              style={{
                ...tw.statusBox,
                backgroundColor: '#e8f5e9',
              }}
            >
              <Text
                style={{
                  ...tw.statusText,
                  color: '#2e7d32',
                }}
              >
                {t('event.registration_open')}
              </Text>
            </View>
          )}

          {/* Registered status */}
          {isRegistered && (
            <View
              style={{
                ...tw.statusBox,
                backgroundColor: '#e3f2fd',
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  ...tw.statusText,
                  color: '#1565c0',
                }}
              >
                {t('event.you_are_registered')}
              </Text>
            </View>
          )}
        </View>

        {/* Admin section - only show if user is admin */}
        {isEventAdmin && (
          <View style={tw.section}>
            <Text style={tw.sectionTitle}>{t('event.admin_tools')}</Text>
            <Text style={tw.description}>{t('event.admin_message')}</Text>
          </View>
        )}

        {/* Add spacer at the bottom to account for floating button */}
        <View style={tw.spacer} />
      </ScrollView>

      {/* Floating button at the bottom - single toggle button */}
      <View style={tw.floatingButtonContainer}>
        <TouchableOpacity
          style={{
            ...tw.floatingButton,
            ...(isRegistrationDisabled
              ? tw.buttonDisabled
              : isRegistered
              ? tw.unregisterButton
              : tw.registerButton),
          }}
          onPress={handleRegistration}
          disabled={isRegistrationDisabled || isRegistering}
        >
          <Text style={tw.buttonText}>
            {isRegistering
              ? t('event.processing')
              : isRegistered
              ? t('event.unregister')
              : t('event.register')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
