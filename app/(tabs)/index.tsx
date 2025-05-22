import * as React from "react";
import { ScrollView, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { Event as ApiEvent } from "~/api/EventDetails"; // Added
import { EventCard } from "~/components/ui/event-card";

export default function HomeScreen() {
  const [progress, setProgress] = React.useState(78);
  const { t } = useTranslation();

  // Mock data for the carousel
  const carouselEvents: ApiEvent[] = [
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
        "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80", // Example poster
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
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80", // Example poster
      club: { name: "Digital Artists Collective", uuid: "club-uuid-456" },
    },
    {
      uuid: "event-uuid-3",
      id: 3,
      name: "Indie Music Showcase",
      description:
        "Discover your new favorite bands at our monthly indie music showcase. Great music, good vibes, and local talent.",
      seatsAvailable: 0, 
      clubId: "club-uuid-789",
      registrationStart: "2025-08-01T12:00:00Z",
      registrationEnd: "2025-09-04T23:59:00Z",
      eventStart: "2025-09-05T18:00:00Z",
      eventEnd: "2025-09-07T23:00:00Z",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: "networking", 
      location: "The Underground Venue",
      poster: undefined, 
      club: { name: "Local Music Scene", uuid: "club-uuid-789" },
    },
  ];

  const registeredEvents: ApiEvent[] = [carouselEvents[0], carouselEvents[1]];
  const suggestedEvents: ApiEvent[] = [
    carouselEvents[2],
    {
      uuid: "event-uuid-4",
      id: 4,
      name: "AI Hackathon 2025",
      description: "Collaborate on AI projects and compete for prizes in our annual hackathon.",
      seatsAvailable: 50,
      clubId: "club-uuid-321",
      registrationStart: "2025-06-10T09:00:00Z",
      registrationEnd: "2025-07-10T17:00:00Z",
      eventStart: "2025-07-15T09:00:00Z",
      eventEnd: "2025-07-17T18:00:00Z",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: "hackathon",
      location: "Innovation Lab, Building A",
      poster: "https://images.unsplash.com/photo-1526378723231-923a01e51f88?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      club: { name: "AI Enthusiasts", uuid: "club-uuid-321" },
    },
    {
      uuid: "event-uuid-5",
      id: 5,
      name: "Data Science Bootcamp",
      description: "A comprehensive bootcamp on data analysis, machine learning, and visualization techniques.",
      seatsAvailable: 40,
      clubId: "club-uuid-987",
      registrationStart: "2025-05-15T10:00:00Z",
      registrationEnd: "2025-06-15T18:00:00Z",
      eventStart: "2025-06-20T09:00:00Z",
      eventEnd: "2025-06-25T17:00:00Z",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: "bootcamp",
      location: "Data Hub, Room 101",
      poster: "https://images.unsplash.com/photo-1562577309-2592ab84b1bc?auto=format&fit=crop&w=1950&q=80",
      club: { name: "Data Wizards", uuid: "club-uuid-987" },
    },
    {
      uuid: "event-uuid-6",
      id: 6,
      name: "Monthly Networking Meetup",
      description: "Connect with fellow professionals and expand your network in our casual meetup.",
      seatsAvailable: 20,
      clubId: "club-uuid-555",
      registrationStart: "2025-05-25T12:00:00Z",
      registrationEnd: "2025-06-25T17:00:00Z",
      eventStart: "2025-07-01T19:00:00Z",
      eventEnd: "2025-07-01T21:00:00Z",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: "networking",
      location: "City Cafe, Lounge Area",
      poster: undefined,
      club: { name: "Connectors Club", uuid: "club-uuid-555" },
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
      {suggestedEvents.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          variant="elegant"
          className="mb-4"
        />
      ))}
    </ScrollView>
  );
}
