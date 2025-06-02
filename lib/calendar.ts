import * as Calendar from 'expo-calendar';
import { Alert, Platform } from 'react-native';
import { Event } from '~/api/EventDetails';

export interface CalendarEventData {
  title: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  notes?: string;
}

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
    console.log('Starting calendar event creation...');
    
    // Double-check if the event already exists before proceeding
    // This is a redundant check just to be safe
    const existingEvent = await checkEventExists(eventData);
    if (existingEvent) {
      console.log('WARNING: Attempted to add an event that already exists. Aborting event creation.');
      throw new Error('Event already exists in calendar');
    }
    
    // Check permissions
    const hasPermissions = await requestCalendarPermissions();
    console.log('Calendar permissions granted:', hasPermissions);
    
    if (!hasPermissions) {
      throw new Error('Calendar permission denied');
    }

    // Get default calendar
    const defaultCalendar = await getDefaultCalendar();
    console.log('Default calendar found:', !!defaultCalendar);
    
    if (!defaultCalendar) {
      throw new Error('No calendar available');
    }

    console.log('Using calendar:', defaultCalendar.title, 'ID:', defaultCalendar.id);

    // Create the calendar event
    const eventDetails = {
      title: eventData.title,
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      location: eventData.location || '',
      notes: eventData.notes || '',
      allDay: false,
    };

    console.log('Creating event with details:', {
      title: eventDetails.title,
      startDate: eventDetails.startDate.toISOString(),
      endDate: eventDetails.endDate.toISOString(),
      location: eventDetails.location,
    });

    // Create the event
    const eventId = await Calendar.createEventAsync(defaultCalendar.id, eventDetails);
    console.log('Event created successfully with ID:', eventId);
    
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
    console.log('=== STARTING CALENDAR EVENT ADDITION ===');
    console.log('Event details:', {
      name: event.name,
      start: new Date(event.eventStart).toISOString(),
      end: new Date(event.eventEnd).toISOString(),
      location: event.location || 'No location'
    });
    
    const calendarData = convertEventToCalendarData(event);
    console.log('Calendar data prepared:', {
      title: calendarData.title,
      start: calendarData.startDate.toISOString(),
      end: calendarData.endDate.toISOString(),
      location: calendarData.location || 'No location'
    });
    
    // Wait for permissions to be established before doing any calendar operations
    const hasPermissions = await requestCalendarPermissions();
    if (!hasPermissions) {
      throw new Error('Calendar permission denied');
    }
    
    // Check if event already exists before trying to add it
    console.log('Checking if event already exists...');
    const eventExists = await checkEventExists(calendarData);
    console.log('Event exists check result:', eventExists);
    
    if (eventExists) {
      // Event already exists, inform the user
      console.log('Duplicate event found, showing alert to user');
      Alert.alert(
        '📅 ' + (translations.event_already_exists || 'Event Already in Calendar'),
        (translations.event_already_exists_message || 'This event is already in your calendar.')
          .replace('This event', `"${event.name}"`),
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }
    
    // Event doesn't exist, proceed to add it
    console.log('No duplicate found, proceeding to add event');
    const eventId = await addEventToCalendar(calendarData);
    
    if (eventId) {
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
 */
export const checkEventExists = async (eventData: CalendarEventData): Promise<boolean> => {
  try {
    console.log('Checking for existing events...', {
      title: eventData.title,
      startDate: eventData.startDate.toISOString(),
      endDate: eventData.endDate.toISOString(),
      location: eventData.location || 'No location'
    });
    
    // Check permissions first
    const hasPermissions = await requestCalendarPermissions();
    if (!hasPermissions) {
      console.log('No permissions to check existing events - permissions not granted');
      return false;
    }

    // Get all calendars to search in
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    if (!calendars || calendars.length === 0) {
      console.log('No calendars available to search');
      return false;
    }
    
    console.log(`Searching through ${calendars.length} calendars for duplicate events`);

    // Create date range for search (search within the event day with a slightly wider window)
    const startSearch = new Date(eventData.startDate);
    startSearch.setHours(0, 0, 0, 0);
    
    const endSearch = new Date(eventData.startDate);
    endSearch.setHours(23, 59, 59, 999);
    
    console.log(`Search range: ${startSearch.toISOString()} - ${endSearch.toISOString()}`);

    // Normalize the event title for better comparison
    const normalizedEventTitle = (eventData.title || '')
      .replace(/^🎉\s*/, '')  // Remove emoji prefix
      .toLowerCase()
      .trim();

    // Search for events in all calendars
    for (const calendar of calendars) {
      try {
        console.log(`Checking calendar: ${calendar.title} (ID: ${calendar.id})`);
        
        const existingEvents = await Calendar.getEventsAsync(
          [calendar.id],
          startSearch,
          endSearch
        );
        
        console.log(`Found ${existingEvents.length} events in this calendar on the same day`);
        
        if (existingEvents.length > 0) {
          console.log('Existing event titles:', existingEvents.map(e => e.title).join(', '));
        }

        // Check if any existing event matches our event
        const duplicateEvent = existingEvents.find(existingEvent => {
          // Check if title matches (remove emoji prefix for comparison)
          const cleanTitle = normalizedEventTitle;
          const cleanExistingTitle = (existingEvent.title || '')
            .replace(/^🎉\s*/, '')
            .toLowerCase()
            .trim();
          
          const titleMatch = cleanExistingTitle.includes(cleanTitle) || 
                             cleanTitle.includes(cleanExistingTitle);

          // Check if start time matches (within 30 minutes)
          const eventStartTime = eventData.startDate.getTime();
          const existingStartTime = new Date(existingEvent.startDate).getTime();
          const timeDiff = Math.abs(existingStartTime - eventStartTime);
          const timeMatch = timeDiff <= 60 * 60 * 1000; // 60 minutes tolerance (increased from 30)

          // Check if location matches (if both have location)
          const locationMatch = !eventData.location || !existingEvent.location ||
                                (existingEvent.location || '').toLowerCase().includes((eventData.location || '').toLowerCase()) ||
                                (eventData.location || '').toLowerCase().includes((existingEvent.location || '').toLowerCase());

          // Log the comparison details for debugging
          if (titleMatch || timeMatch) {
            console.log('Potential match found:', {
              existingTitle: existingEvent.title,
              newTitle: eventData.title,
              titleMatch,
              existingStartTime: new Date(existingEvent.startDate).toISOString(),
              newStartTime: eventData.startDate.toISOString(),
              timeMatch,
              timeDiffMinutes: Math.round(timeDiff / (60 * 1000)),
              existingLocation: existingEvent.location,
              newLocation: eventData.location,
              locationMatch
            });
          }

          return titleMatch && timeMatch && locationMatch;
        });

        if (duplicateEvent) {
          console.log('DUPLICATE FOUND:', duplicateEvent.title, 'in calendar:', calendar.title);
          console.log('Original event title:', eventData.title);
          console.log('Existing event start:', new Date(duplicateEvent.startDate).toISOString());
          console.log('New event start:', eventData.startDate.toISOString());
          return true;
        }
      } catch (error) {
        console.log('Error searching calendar:', calendar.title, error);
        // Continue searching other calendars
      }
    }

    console.log('No existing event found - OK to add new event');
    return false;
  } catch (error) {
    console.error('Error checking for existing events:', error);
    // Let's return false to not block adding events when checks fail
    return false;
  }
};
