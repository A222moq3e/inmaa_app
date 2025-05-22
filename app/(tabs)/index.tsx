import * as React from "react";
import { ScrollView, Text, ActivityIndicator, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Event as ApiEvent, getAllEvents, getEventById } from "~/api/EventDetails";
import { EventCard } from "~/components/ui/event-card";
import { EventCard as RegistrationCard } from "~/components/ui/registration-card";
import { getUserProfile } from "~/api/profile";
import { useAuth } from "~/context/AuthContext";

// Define vibrant background colors for cards
const cardColors = [
  "bg-blue-500", "bg-green-500", "bg-yellow-500", 
  "bg-purple-500", "bg-pink-500", "bg-red-500", 
  "bg-indigo-500", "bg-teal-500", "bg-orange-500"
];

export default function HomeScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [suggestedEvents, setSuggestedEvents] = React.useState<ApiEvent[]>([]);
  const [registeredEvents, setRegisteredEvents] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingRegisteredEvents, setLoadingRegisteredEvents] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const events = await getAllEvents();
        
        // Assign categories to events that don't have them
        // This will help with color display since the EventCard uses categories for styling
        const processedEvents = events.map(event => {
          if (!event.category) {
            const categories = ["workshop", "conference", "hackathon", "networking", "bootcamp", "seminar"];
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];
            return { ...event, category: randomCategory };
          }
          return event;
        });
        
        setSuggestedEvents(processedEvents);
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
          return;
        }
        
        const userId = user.id || user.uuid || '';
        const profile = await getUserProfile(userId);
        
        // Only process registrations with "accepted" status
        const acceptedRegistrations = profile.eventRegistration?.filter(reg => 
          reg.status === 'accepted'
        ) || [];
        
        if (acceptedRegistrations.length > 0) {
          const eventPromises = acceptedRegistrations.map(async (reg) => {
            try {
              const eventResponse = await getEventById(reg.eventId);
              const eventData = eventResponse.event || (eventResponse.data?.event);
              
              if (eventData) {
                // Format data for the registration card
                return {
                  id: reg.id,
                  eventId: reg.eventId,
                  title: eventData.name,
                  date: eventData.eventStart ? new Date(eventData.eventStart).toLocaleDateString() : undefined,
                  location: eventData.location,
                  status: reg.status
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
        console.error('Failed to load registered events:', err);
        setRegisteredEvents([]);
      } finally {
        setLoadingRegisteredEvents(false);
      }
    };

    fetchRegisteredEvents();
  }, [user]);

  return (
    <ScrollView
      className="flex-1 bg-secondary/30 p-6"
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <Text className="text-lg font-semibold mb-2">
        {t("home.registered_events")}
      </Text>
      
      {loadingRegisteredEvents ? (
        <View className="h-32 justify-center items-center">
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      ) : registeredEvents.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6"
        >
          {registeredEvents.map((event) => (
            <RegistrationCard
              key={event.id}
              event={event}
              className="mr-4"
            />
          ))}
        </ScrollView>
      ) : (
        <View className="h-24 justify-center items-center mb-6 bg-card/50 rounded-lg">
          <Text className="text-muted-foreground">
            {t("home.no_registered_events", "You don't have any accepted event registrations.")}
          </Text>
        </View>
      )}
      
      <Text className="text-lg font-semibold mb-2">
        {t("home.suggested_events")}
      </Text>
      
      {loading ? (
        <View className="py-10 flex items-center justify-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : error ? (
        <Text className="text-red-500 py-4">{error}</Text>
      ) : suggestedEvents.length === 0 ? (
        <Text className="py-4">{t("home.no_events_available")}</Text>
      ) : (
        suggestedEvents.map((event) => (
          <EventCard
            key={event.uuid}
            event={event}
            variant="elegant"
            className="mb-4"
          />
        ))
      )}
    </ScrollView>
  );
}
