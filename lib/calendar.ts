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
    
    // IMPORTANT: First check our local cache to see if we've already added this event
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
    
    // First ensure we have permissions before doing anything
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
    
    // IMPORTANT: Also check calendar API as a secondary measure
    // Making this a separate step with its own try/catch to ensure it runs properly
    let isDuplicate = false;
    try {
      console.log('🔍 Checking for duplicate events in calendar...');
      isDuplicate = await checkEventExists(calendarData);
      console.log('Duplicate check result:', isDuplicate);
    } catch (duplicateError) {
      console.error('❌ Error checking for duplicates:', duplicateError);
      // If we can't check for duplicates, we'll rely on our cache
      isDuplicate = false;
    }
    
    // Handle duplicate event
    if (isDuplicate) {
      console.log('❗ Duplicate event found in calendar - alerting user');
      // Also add to cache for future reference
      await addEventToCache(event);
      
      Alert.alert(
        '📅 ' + (translations.event_already_exists || 'Event Already in Calendar'),
        (translations.event_already_exists_message || 'This event is already in your calendar.')
          .replace('This event', `"${event.name}"`),
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }
    
    // Event doesn't exist, proceed to add it
    console.log('✅ No duplicate found, adding event to calendar');
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

/**
 * Checks if an event with similar details already exists in the calendar
 * Complete rewrite with a more reliable detection algorithm
 */
export const checkEventExists = async (eventData: CalendarEventData): Promise<boolean> => {
  try {
    console.log('🔍 CHECKING FOR DUPLICATE EVENTS');
    console.log('Event to check:', {
      title: eventData.title,
      startDate: eventData.startDate.toISOString(),
      endDate: eventData.endDate.toISOString(),
      location: eventData.location || 'No location'
    });
    
    // Always check permissions first and return early if not granted
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    console.log('Calendar permission status:', status);
    if (status !== 'granted') {
      console.error('❌ Cannot check for existing events: No calendar permissions');
      return false; 
    }

    // Extract key data from the event for comparison
    const eventTitle = (eventData.title || '').replace(/^🎉\s*/, '').toLowerCase().trim();
    const eventStart = eventData.startDate;
    const eventLocation = (eventData.location || '').toLowerCase().trim();
    
    // Get all available calendars - we need to check all of them
    const allCalendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    if (!allCalendars || allCalendars.length === 0) {
      console.log('❌ No calendars found to search');
      return false;
    }
    console.log(`📅 Found ${allCalendars.length} calendars to search`);
    
    // Create a wider time window for search (the entire day of the event)
    const startOfDay = new Date(eventStart);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(eventStart);
    endOfDay.setHours(23, 59, 59, 999);
    
    console.log(`⏰ Search window: ${startOfDay.toISOString()} to ${endOfDay.toISOString()}`);

    // For each calendar, check for matching events
    for (const calendar of allCalendars) {
      try {
        console.log(`Searching calendar: "${calendar.title}" (${calendar.id})`);
        
        // Get all events for the day
        const events = await Calendar.getEventsAsync(
          [calendar.id],
          startOfDay,
          endOfDay
        );
        
        console.log(`Found ${events.length} events on this day in calendar "${calendar.title}"`);
        
        // Detailed examination of each event
        for (const existingEvent of events) {
          // Prepare normalized data for comparison
          const existingTitle = (existingEvent.title || '').replace(/^🎉\s*/, '').toLowerCase().trim();
          const existingStart = new Date(existingEvent.startDate);
          const existingLocation = (existingEvent.location || '').toLowerCase().trim();
          
          // Calculate time difference in minutes
          const timeDiffMinutes = Math.abs(existingStart.getTime() - eventStart.getTime()) / (1000 * 60);
          
          // Different matching criteria:
          // 1. Title is very similar AND start time is close (within 90 minutes)
          // 2. Title is the same event and on the same day (regardless of time)
          const isTitleExactMatch = existingTitle === eventTitle;
          const isTitleSimilar = 
            existingTitle.includes(eventTitle) || 
            eventTitle.includes(existingTitle) ||
            (existingTitle.length > 5 && eventTitle.length > 5 && 
             (existingTitle.includes(eventTitle.substring(0, 5)) || 
              eventTitle.includes(existingTitle.substring(0, 5))));
              
          const isTimeClose = timeDiffMinutes < 90;
          const isSameDay = 
            existingStart.getDate() === eventStart.getDate() &&
            existingStart.getMonth() === eventStart.getMonth() &&
            existingStart.getFullYear() === eventStart.getFullYear();
            
          const isLocationMatch = 
            !eventLocation || 
            !existingLocation || 
            existingLocation.includes(eventLocation) || 
            eventLocation.includes(existingLocation);
            
          // Advanced duplicate detection logic
          const isDuplicate = (isTitleSimilar && isTimeClose && isLocationMatch) || 
                             (isTitleExactMatch && isSameDay);
                             
          // Log all potential matches for debugging
          if (isTitleSimilar || isTimeClose) {
            console.log('⚠️ Potential duplicate analysis:', {
              existingTitle: existingEvent.title,
              newTitle: eventData.title,
              titleExact: isTitleExactMatch,
              titleSimilar: isTitleSimilar,
              timeDiffMinutes: Math.round(timeDiffMinutes),
              timeClose: isTimeClose,
              sameDay: isSameDay,
              locationMatch: isLocationMatch,
              isDuplicate: isDuplicate
            });
          }
          
          // If duplicate found, return immediately
          if (isDuplicate) {
            console.log('‼️ DUPLICATE EVENT DETECTED:', {
              calendar: calendar.title,
              existingTitle: existingEvent.title,
              newTitle: eventData.title,
              existingTime: existingStart.toISOString(),
              newTime: eventStart.toISOString(),
              timeDiffMinutes: Math.round(timeDiffMinutes)
            });
            return true;
          }
        }
      } catch (error) {
        console.error(`Error searching calendar "${calendar.title}":`, error);
        // Continue with other calendars even if one fails
      }
    }

    console.log('✅ No duplicate events found');
    return false;
  } catch (error) {
    console.error('❌ Error in duplicate event check:', error);
    // If we encounter an error in the check, it's safer to allow adding the event
    return false;
  }
};
