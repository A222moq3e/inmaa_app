import * as Calendar from 'expo-calendar';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Event } from '~/api/EventDetails';

export interface CalendarEventData {
  title: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  notes?: string;
}

// Key for storing calendar event cache in AsyncStorage
const CALENDAR_EVENTS_CACHE_KEY = 'wasl-mobile:calendar-events-cache';

// Format for creating a unique key for each event
const getEventCacheKey = (event: Event): string => {
  return `${event.id}:${event.name}:${event.eventStart}`;
};

/**
 * Check if an event has already been added to the calendar by checking the cache
 */
const isEventInCache = async (event: Event): Promise<boolean> => {
  try {
    const cacheData = await AsyncStorage.getItem(CALENDAR_EVENTS_CACHE_KEY);
    if (!cacheData) return false;
    
    const cachedEvents: Record<string, boolean> = JSON.parse(cacheData);
    const eventKey = getEventCacheKey(event);
    
    return !!cachedEvents[eventKey];
  } catch (error) {
    console.error('Error checking event cache:', error);
    return false;
  }
};

/**
 * Add an event to the cache after it's been added to the calendar
 */
const addEventToCache = async (event: Event): Promise<void> => {
  try {
    const cacheData = await AsyncStorage.getItem(CALENDAR_EVENTS_CACHE_KEY);
    const cachedEvents: Record<string, boolean> = cacheData ? JSON.parse(cacheData) : {};
    
    const eventKey = getEventCacheKey(event);
    cachedEvents[eventKey] = true;
    
    await AsyncStorage.setItem(CALENDAR_EVENTS_CACHE_KEY, JSON.stringify(cachedEvents));
    console.log('✅ Event added to cache:', eventKey);
  } catch (error) {
    console.error('Error adding event to cache:', error);
  }
};

/**
 * Requests calendar permissions from the user
 */
export const requestCalendarPermissions = async (): Promise<boolean> => {
  try {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting calendar permissions:', error);
    return false;
  }
};

/**
 * Gets the default calendar for the device
 */
export const getDefaultCalendar = async (): Promise<Calendar.Calendar | null> => {
  try {
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    
    console.log('Available calendars:', calendars?.length || 0);
    
    if (!calendars || calendars.length === 0) {
      // Try to create a default calendar if none exist
      console.log('No calendars found, attempting to create one...');
      return await createDefaultCalendar();
    }
    
    // Find the best calendar based on platform
    let defaultCalendar = null;
    
    if (Platform.OS === 'ios') {
      // On iOS, prioritize in this order:
      // 1. Default calendar
      // 2. iCloud calendar
      // 3. Any writable calendar
      // 4. First available calendar
      defaultCalendar = 
        calendars.find(cal => cal.source?.name === 'Default') ||
        calendars.find(cal => cal.source?.name === 'iCloud') ||
        calendars.find(cal => cal.allowsModifications) ||
        calendars[0];
    } else {
      // On Android, prioritize in this order:
      // 1. Primary Google calendar
      // 2. Any Google calendar
      // 3. Any writable calendar
      // 4. First available calendar
      defaultCalendar = 
        calendars.find(cal => cal.isPrimary) ||
        calendars.find(cal => cal.source?.name?.toLowerCase().includes('google')) ||
        calendars.find(cal => cal.allowsModifications) ||
        calendars[0];
    }
    
    if (defaultCalendar) {
      console.log('Selected calendar:', defaultCalendar.title, 'allowsModifications:', defaultCalendar.allowsModifications);
    }
    
    return defaultCalendar || null;
  } catch (error) {
    console.error('Error getting calendars:', error);
    return null;
  }
};

/**
 * Creates a default calendar if none exist
 */
export const createDefaultCalendar = async (): Promise<Calendar.Calendar | null> => {
  try {
    if (Platform.OS === 'ios') {
      // On iOS, we can't create calendars through the API
      // User needs to have at least one calendar configured
      console.log('iOS requires at least one calendar to be configured in the device settings');
      return null;
    }
    
    // On Android, try to create a local calendar
    const defaultCalendarSource = {
      isLocalAccount: true,
      name: 'Local Calendar',
      type: Calendar.CalendarType.LOCAL,
    } as Calendar.Source;

    const newCalendarID = await Calendar.createCalendarAsync({
      title: 'Events',
      color: '#0284c7',
      entityType: Calendar.EntityTypes.EVENT,
      sourceId: defaultCalendarSource.id,
      source: defaultCalendarSource,
      name: 'Events',
      ownerAccount: 'Local',
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
    });

    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    return calendars.find(cal => cal.id === newCalendarID) || null;
  } catch (error) {
    console.error('Error creating default calendar:', error);
    return null;
  }
};

/**
 * Adds an event to the device calendar
 */
export const addEventToCalendar = async (eventData: CalendarEventData): Promise<string | null> => {
  try {
    console.log('📝 Creating calendar event...');
    
    // We don't need to check for duplicates again here as it's already done in the wrapper function
    // Get default calendar
    const defaultCalendar = await getDefaultCalendar();
    
    if (!defaultCalendar) {
      console.error('❌ No calendar available');
      throw new Error('No calendar available');
    }

    console.log(`📅 Using calendar: "${defaultCalendar.title}" (ID: ${defaultCalendar.id})`);

    // Create the calendar event
    const eventDetails = {
      title: eventData.title,
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      location: eventData.location || '',
      notes: eventData.notes || '',
      allDay: false,
    };

    console.log('Event details:', {
      title: eventDetails.title,
      startDate: eventDetails.startDate.toISOString(),
      endDate: eventDetails.endDate.toISOString(),
      location: eventDetails.location || '(No location)'
    });

    // Create the event
    const eventId = await Calendar.createEventAsync(defaultCalendar.id, eventDetails);
    console.log('✅ Event created successfully with ID:', eventId);
    
    return eventId;
  } catch (error) {
    console.error('Error adding event to calendar:', error);
    throw error;
  }
};

/**
 * Converts an Event object to CalendarEventData
 */
export const convertEventToCalendarData = (event: Event): CalendarEventData => {
  const startDate = new Date(event.eventStart);
  const endDate = new Date(event.eventEnd);
  
  // Create a comprehensive description for the calendar event
  const noteParts = [
    `📝 ${event.description}`,
    event.location ? `📍 Location: ${event.location}` : '',
    event.club?.name ? `🏢 Organized by: ${event.club.name}` : '',
    `💺 Available seats: ${event.seatsAvailable}`,
    `📅 Registration: ${new Date(event.registrationStart).toLocaleDateString()} - ${new Date(event.registrationEnd).toLocaleDateString()}`,
  ].filter(Boolean);

  return {
    title: `🎉 ${event.name}`,
    startDate,
    endDate,
    location: event.location,
    notes: noteParts.join('\n\n'),
  };
};

/**
 * Helper function to add an Event to calendar with proper error handling
 */
export const addEventToCalendarWithHandling = async (
  event: Event,
  translations: {
    added_to_calendar: string;
    calendar_permission_denied: string;
    calendar_error: string;
    calendar_permission_title: string;
    calendar_permission_message: string;
    event_already_exists?: string;
    event_already_exists_message?: string;
  }
): Promise<void> => {
  try {
    console.log('🚀 STARTING CALENDAR EVENT ADDITION');
    console.log('Event details:', {
      id: event.id,
      name: event.name,
      start: new Date(event.eventStart).toISOString(),
      end: new Date(event.eventEnd).toISOString(),
      location: event.location || 'No location'
    });
    
    // IMPORTANT: Check our local cache to see if we've already added this event
    const isInCache = await isEventInCache(event);
    if (isInCache) {
      console.log('📌 Event found in local cache - preventing duplicate');
      Alert.alert(
        '📅 ' + (translations.event_already_exists || 'Event Already in Calendar'),
        (translations.event_already_exists_message || 'This event is already in your calendar.')
          .replace('This event', `"${event.name}"`),
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }
    
    // Ensure we have permissions before doing anything
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== 'granted') {
      console.error('❌ Calendar permission denied');
      Alert.alert(
        '🔒 ' + translations.calendar_permission_title,
        translations.calendar_permission_message,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Settings', 
            style: 'default',
            onPress: () => console.log('Open settings to grant calendar permission')
          }
        ]
      );
      return;
    }
    
    // Prepare the event data
    const calendarData = convertEventToCalendarData(event);
    
    // Proceed to add the event directly without calendar API check
    console.log('✅ Adding event to calendar');
    const eventId = await addEventToCalendar(calendarData);
    
    if (eventId) {
      // Successfully added - store in our cache to prevent future duplicates
      await addEventToCache(event);
      
      Alert.alert(
        '📅 ' + translations.added_to_calendar,
        `"${event.name}" has been successfully added to your calendar!`,
        [{ text: 'Great!', style: 'default' }]
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Calendar error details:', errorMessage);
    
    if (errorMessage.includes('permission') || errorMessage.includes('denied')) {
      Alert.alert(
        '🔒 ' + translations.calendar_permission_title,
        translations.calendar_permission_message,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Settings', 
            style: 'default',
            onPress: () => {
              // On production, you might want to open the device settings
              console.log('Open settings to grant calendar permission');
            }
          }
        ]
      );
    } else if (errorMessage.includes('No calendar available')) {
      // Specific handling for no calendar available
      Alert.alert(
        '📅 Calendar Setup Required',
        Platform.OS === 'ios' 
          ? 'No calendars are configured on your device. Please set up at least one calendar in your device Settings > Calendar & Accounts.'
          : 'No calendars are available. Please set up a Google account or local calendar in your device settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Settings', 
            style: 'default',
            onPress: () => {
              console.log('Guide user to calendar settings');
            }
          }
        ]
      );
    } else {
      Alert.alert(
        '❌ ' + translations.calendar_error,
        `Sorry, we couldn't add this event to your calendar.\n\nError: ${errorMessage}`,
        [{ text: 'OK', style: 'default' }]
      );
    }
  }
};
