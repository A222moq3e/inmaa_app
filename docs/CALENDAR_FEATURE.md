# Add to Calendar Feature

## Overview

The Add to Calendar feature allows users to add event details directly to their device's calendar app. This feature is implemented using Expo Calendar API and provides a seamless integration between the app and the user's calendar.

## Features

- **One-click calendar addition**: Users can add events to their calendar with a single button press
- **Rich event details**: Calendar events include:
  - Event title with emoji indicator (🎉)
  - Event description with formatted notes (📝)
  - Location information (📍)
  - Organizer details (🏢)
  - Available seats information (💺)
  - Registration period (📅)
- **Permission handling**: Automatically requests calendar permissions
- **Error handling**: Graceful error handling with user-friendly messages
- **Loading states**: Visual feedback during the calendar addition process
- **Multilingual support**: Available in English and Arabic

## Implementation Details

### Files Modified

1. **`lib/calendar.ts`** - Main calendar utility functions
2. **`app/EventDetails.tsx`** - Event details screen with calendar button
3. **`i18n/en.json`** & **`i18n/ar.json`** - Translation files
4. **`app.json`** - App configuration with calendar permissions
5. **`package.json`** - Added expo-calendar dependency

### Dependencies Added

- `expo-calendar ^14.1.4` - Expo Calendar API for calendar integration

### Permissions Required

#### iOS
- `NSCalendarsUsageDescription` - Calendar access permission

#### Android
- `android.permission.READ_CALENDAR` - Read calendar permission
- `android.permission.WRITE_CALENDAR` - Write calendar permission

## Usage

1. Navigate to any event details page
2. Scroll to the event details section
3. Click the "Add to Calendar" button
4. Grant calendar permissions if prompted
5. The event will be added to the default calendar

## User Experience

- The button shows a loading indicator while processing
- Success message confirms the event was added
- Error messages provide clear feedback if something goes wrong
- Permission dialogs guide users to grant necessary permissions

## Translation Keys

### English
- `event.add_to_calendar`: "Add to Calendar"
- `event.added_to_calendar`: "Event added to calendar"
- `event.calendar_permission_denied`: "Calendar permission denied"
- `event.calendar_error`: "Failed to add event to calendar"
- `event.calendar_permission_title`: "Calendar Permission"
- `event.calendar_permission_message`: "This app needs access to your calendar to add events."

### Arabic
- `event.add_to_calendar`: "إضافة إلى التقويم"
- `event.added_to_calendar`: "تمت إضافة الفعالية إلى التقويم"
- `event.calendar_permission_denied`: "تم رفض إذن التقويم"
- `event.calendar_error`: "فشل في إضافة الفعالية إلى التقويم"
- `event.calendar_permission_title`: "إذن التقويم"
- `event.calendar_permission_message`: "يحتاج هذا التطبيق إلى الوصول إلى التقويم لإضافة الفعاليات."

## Technical Notes

- Calendar events are created with proper date/time formatting
- The feature works on both iOS and Android
- Fallback handling for devices without calendar access
- No network requests required - all operations are local

## Future Enhancements

Potential improvements could include:
- Reminder settings (15 minutes before, 1 hour before, etc.)
- Calendar selection (allow users to choose which calendar to use)
- Event updates when event details change
- Bulk calendar import for multiple events

## Troubleshooting

### "No calendar available" Error

If users encounter the "No calendar available" error, it typically means:

#### iOS Devices:
- No calendars are configured on the device
- User needs to set up at least one calendar in **Settings > Calendar & Accounts**
- The app will guide users to device settings when this error occurs

#### Android Devices:
- No Google account or local calendar is configured
- The app attempts to create a local calendar automatically
- If automatic creation fails, users are guided to set up a calendar in device settings

### Calendar Permission Issues

The app automatically requests calendar permissions when the user tries to add an event:
- **iOS**: Requires `NSCalendarsUsageDescription` in Info.plist (already configured)
- **Android**: Requires `READ_CALENDAR` and `WRITE_CALENDAR` permissions (already configured)

### Enhanced Error Handling

The updated implementation includes:
- Detailed logging for debugging calendar issues
- Platform-specific calendar detection and creation
- User-friendly error messages with guidance
- Automatic fallback to local calendar creation on Android
