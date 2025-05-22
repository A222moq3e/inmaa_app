import * as React from "react";
import { ScrollView, Text, ActivityIndicator, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Event as ApiEvent, getAllEvents } from "~/api/EventDetails";
import { EventCard } from "~/components/ui/event-card";

// Define vibrant background colors for cards
const cardColors = [
  "bg-blue-500", "bg-green-500", "bg-yellow-500", 
  "bg-purple-500", "bg-pink-500", "bg-red-500", 
  "bg-indigo-500", "bg-teal-500", "bg-orange-500"
];

export default function HomeScreen() {
  const [progress, setProgress] = React.useState(78);
  const { t } = useTranslation();
  const [suggestedEvents, setSuggestedEvents] = React.useState<ApiEvent[]>([]);
  const [loading, setLoading] = React.useState(true);
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

  // Mock data for registered events with assigned categories
  const registeredEvents: ApiEvent[] = [
    {
      uuid: "event-uuid-1", 
      id: 1,
      name: "Tech Conference 2025",
      description:
        "An annual conference for tech enthusiasts and professionals. Join us for a day of learning, networking, and exploring the latest trends in technology.",
      seatsAvailable: 150, 
      clubId: "club-uuid-123", 
      registrationStart: "2025-06-01T09:00:00Z",
      registrationEnd: "2025-08-10T17:00:00Z",
      eventStart: "2025-08-15T09:00:00Z",
      eventEnd: "2025-08-15T17:00:00Z",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: "conference", 
      location: "Online via Zoom",
      poster:
        "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      club: {
        name: "Tech Innovators Club",
        uuid: "club-uuid-123",
        logo: "https://example.com/logo.png",
      },
    },
    {
      uuid: "event-uuid-2",
      id: 2,
      name: "Creative Coding Workshop",
      description:
        "Explore the intersection of art and code in this hands-on workshop. No prior coding experience required, just a curious mind!",
      seatsAvailable: 25,
      clubId: "club-uuid-456",
      registrationStart: "2025-06-15T10:00:00Z",
      registrationEnd: "2025-07-15T17:00:00Z",
      eventStart: "2025-07-20T14:00:00Z",
      eventEnd: "2025-07-20T18:00:00Z",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: "workshop", 
      location: "Community Art & Tech Center, Room 3",
      poster:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      club: { name: "Digital Artists Collective", uuid: "club-uuid-456" },
    },
  ];

  return (
    <ScrollView
      className="flex-1 bg-secondary/30 p-6"
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <Text className="text-lg font-semibold mb-2">
        {t("home.registered_events")}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-6"
      >
        {registeredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            variant="compact"
            className="mr-4"
          />
        ))}
      </ScrollView>
      
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
