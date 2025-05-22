import * as React from "react";
import { ScrollView, ActivityIndicator, View, RefreshControl } from "react-native";
import { useTranslation } from "react-i18next";
import { Event as ApiEvent, getAllEvents, getEventById } from "~/api/EventDetails";
import { EventCard } from "~/components/ui/event-card";
import { EventCard as RegistrationCard } from "~/components/ui/registration-card";
import { getUserProfile } from "~/api/profile";
import { useAuth } from "~/context/AuthContext";
import { Text } from "~/components/ui/text";

export default function HomeScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [suggestedEvents, setSuggestedEvents] = React.useState<ApiEvent[]>([]);
  const [registeredEvents, setRegisteredEvents] = React.useState<any[]>([]);
  const [allEvents, setAllEvents] = React.useState<ApiEvent[]>([]);
  const [registeredEventIds, setRegisteredEventIds] = React.useState<(string | number)[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingRegisteredEvents, setLoadingRegisteredEvents] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);

  // Function to handle pull-to-refresh
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setError(null);
    
    try {
      // Fetch all events
      const events = await getAllEvents();
      setAllEvents(events);
      
      // Fetch registered events if user is logged in
      if (user && (user.id || user.uuid)) {
        const userId = user.id || user.uuid || "";
        const profile = await getUserProfile(userId);
        const acceptedRegistrations = profile.eventRegistration || [];
        
        // Update registered event IDs
        const eventIds = acceptedRegistrations.map((reg) => reg.eventId);
        setRegisteredEventIds(eventIds);
        
        if (acceptedRegistrations.length > 0) {
          const eventPromises = acceptedRegistrations.map(async (reg) => {
            try {
              const eventResponse = await getEventById(reg.eventId);
              const eventData = eventResponse.event || eventResponse.data?.event;
              
              if (eventData) {
                return {
                  id: reg.id,
                  eventId: reg.eventId,
                  title: eventData.name,
                  date: eventData.eventStart ? new Date(eventData.eventStart).toLocaleDateString() : undefined,
                  location: eventData.location,
                  status: reg.status,
                };
              }
              return null;
            } catch (err) {
              console.error(`Failed to load event ${reg.eventId}:`, err);
              return null;
            }
          });
          
          const eventDetails = await Promise.all(eventPromises);
          setRegisteredEvents(eventDetails.filter(Boolean));
        } else {
          setRegisteredEvents([]);
        }
      }
    } catch (err) {
      console.error("Error refreshing data:", err);
      setError(t("errors.fetch_events"));
    } finally {
      setRefreshing(false);
    }
  }, [t, user]);

  // Fetch all events first
  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const events = await getAllEvents();
        setAllEvents(events);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(t("errors.fetch_events"));
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [t]);

  // Load user's registered events
  React.useEffect(() => {
    const fetchRegisteredEvents = async () => {
      setLoadingRegisteredEvents(true);
      try {
        if (!user || (!user.id && !user.uuid)) {
          setRegisteredEvents([]);
          setRegisteredEventIds([]);
          return;
        }

        const userId = user.id || user.uuid || "";
        const profile = await getUserProfile(userId);

        const acceptedRegistrations = profile.eventRegistration || [];

        // Store registered event IDs for filtering suggested events later
        const eventIds = acceptedRegistrations.map((reg) => reg.eventId);
        setRegisteredEventIds(eventIds);

        if (acceptedRegistrations.length > 0) {
          const eventPromises = acceptedRegistrations.map(async (reg) => {
            try {
              const eventResponse = await getEventById(reg.eventId);
              const eventData = eventResponse.event || eventResponse.data?.event;

              if (eventData) {
                // Format data for the registration card
                return {
                  id: reg.id,
                  eventId: reg.eventId,
                  title: eventData.name,
                  date: eventData.eventStart ? new Date(eventData.eventStart).toLocaleDateString() : undefined,
                  location: eventData.location,
                  status: reg.status,
                };
              }
              return null;
            } catch (err) {
              console.error(`Failed to load event ${reg.eventId}:`, err);
              return null;
            }
          });

          const eventDetails = await Promise.all(eventPromises);
          setRegisteredEvents(eventDetails.filter(Boolean));
        } else {
          setRegisteredEvents([]);
        }
      } catch (err) {
        console.error("Failed to load registered events:", err);
        setRegisteredEvents([]);
        setRegisteredEventIds([]);
      } finally {
        setLoadingRegisteredEvents(false);
      }
    };

    fetchRegisteredEvents();
  }, [user]);

  // Filter suggested events once we have both all events and registered events
  React.useEffect(() => {
    if (allEvents.length > 0) {
      // Filter out events that the user has already registered for
      const filtered = allEvents.filter((event) => {
        // Check if the event's uuid or id exists in registeredEventIds
        return !registeredEventIds.some((regId) => 
          regId === event.uuid || regId === event.id
        );
      });
      setSuggestedEvents(filtered);
    }
  }, [allEvents, registeredEventIds]);

  return (
    <ScrollView
      className="flex-1 bg-secondary/30 p-6"
      contentContainerStyle={{ paddingBottom: 24 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          title={t("home.refreshing")}
          tintColor="#0000ff"
          titleColor="#0000ff"
        />
      }
    >
      <Text className="text-lg font-semibold mb-2">{t("home.registered_events")}</Text>

      {loadingRegisteredEvents ? (
        <View className="h-32 justify-center items-center">
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      ) : registeredEvents.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
          {registeredEvents.map((event) => (
            <RegistrationCard key={event.id} event={event} className="mr-4" />
          ))}
        </ScrollView>
      ) : (
        <View className="h-24 justify-center items-center mb-6 bg-card/50 rounded-lg">
          <Text className="text-muted-foreground">
            {t("home.no_registered_events", "You don't have any accepted event registrations.")}
          </Text>
        </View>
      )}

      <Text className="text-lg font-semibold mb-2">{t("home.suggested_events")}</Text>

      {loading || loadingRegisteredEvents ? (
        <View className="py-10 flex items-center justify-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : error ? (
        <Text className="text-red-500 py-4">{error}</Text>
      ) : suggestedEvents.length === 0 ? (
        <Text className="py-4">{t("home.no_events_available")}</Text>
      ) : (
        suggestedEvents.map((event) => (
          <EventCard key={event.uuid} event={event} variant="elegant" className="mb-4" />
        ))
      )}
    </ScrollView>
  );
}
