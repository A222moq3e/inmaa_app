import * as React from "react";
import { View, Text, Image, Pressable, ImageBackground, ImageSourcePropType } from "react-native";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { cn } from "~/lib/utils";
import { Card } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Calendar, MapPin, Clock, Users } from "lucide-react-native";
import { Event as ApiEvent } from "~/api/EventDetails";

export type EventCategory = NonNullable<ApiEvent['category']> | "other";
export type EventStatus = "upcoming" | "ongoing" | "completed" | "registration" | "full";

export interface ProcessedEventData {
  id: number;
  name?: string;
  poster?: string;
  description?: string;
  location?: string;
  eventStart?: string;
  eventEnd?: string;
  registrationStart?: string;
  registrationEnd?: string;
  seatsAvailable?: number;
  category: EventCategory;
  status: EventStatus;
  clubId?: number;
}

export interface EventCardProps {
  event: ApiEvent;
  variant?: "elegant" | "compact";
  className?: string;
  onPress?: (eventId: number) => void;
}

const categoryThemes: Record<EventCategory, { overlay: string; badge: string; accent: string; progress: string; }> = {
  bootcamp: { overlay: "rgba(25, 118, 210, 0.85)", badge: "bg-blue-500", accent: "text-blue-500", progress: "bg-blue-600" },
  workshop: { overlay: "rgba(156, 39, 176, 0.85)", badge: "bg-purple-500", accent: "text-purple-500", progress: "bg-purple-600" },
  meeting: { overlay: "rgba(46, 125, 50, 0.85)", badge: "bg-green-500", accent: "text-green-500", progress: "bg-green-600" },
  hackathon: { overlay: "rgba(245, 124, 0, 0.85)", badge: "bg-orange-500", accent: "text-orange-500", progress: "bg-orange-600" },
  seminar: { overlay: "rgba(121, 85, 72, 0.85)", badge: "bg-yellow-700", accent: "text-yellow-700", progress: "bg-yellow-800" },
  conference: { overlay: "rgba(0, 150, 136, 0.85)", badge: "bg-teal-500", accent: "text-teal-500", progress: "bg-teal-600" },
  networking: { overlay: "rgba(3, 169, 244, 0.85)", badge: "bg-sky-500", accent: "text-sky-500", progress: "bg-sky-600" },
  other: { overlay: "rgba(66, 66, 66, 0.85)", badge: "bg-gray-500", accent: "text-gray-500", progress: "bg-gray-600" },
};

const formatDate = (dateInput?: string | Date): string => {
  if (!dateInput) return "";
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const formatTime = (dateInput?: string | Date): string => {
  if (!dateInput) return "";
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true });
};

const getTheme = (category: EventCategory) => categoryThemes[category];

function processApiEvent(apiEvent: ApiEvent): ProcessedEventData {
  const now = new Date();
  const eventStart = apiEvent.eventStart ? new Date(apiEvent.eventStart) : null;
  const eventEnd = apiEvent.eventEnd ? new Date(apiEvent.eventEnd) : null;
  const registrationStart = apiEvent.registrationStart ? new Date(apiEvent.registrationStart) : null;
  const registrationEnd = apiEvent.registrationEnd ? new Date(apiEvent.registrationEnd) : null;

  let status: EventStatus;
  if (eventEnd && now > eventEnd) {
    status = "completed";
  } else if (eventStart && eventEnd && now >= eventStart && now <= eventEnd) {
    status = "ongoing";
  } else if (registrationStart && registrationEnd && now >= registrationStart && now <= registrationEnd) {
    status = "registration";
  } else if (eventStart && now < eventStart) {
    status = "upcoming";
  } else {
    status = "upcoming";
  }

  if (status !== "completed" && status !== "ongoing" && apiEvent.seatsAvailable === 0) {
    status = "full";
  }
  
  const processedCategory = apiEvent.category ?? "other";

  const id = apiEvent.id as number;

  let clubIdAsNumber: number | undefined = undefined;
  if (typeof apiEvent.clubId === 'string') {
    const parsedClubId = parseInt(apiEvent.clubId, 10);
    if (!isNaN(parsedClubId)) {
      clubIdAsNumber = parsedClubId;
    }
  } else if (typeof apiEvent.clubId === 'number') {
    clubIdAsNumber = apiEvent.clubId;
  }

  return {
    id: id,
    name: apiEvent.name,
    poster: apiEvent.poster,
    description: apiEvent.description,
    location: apiEvent.location,
    eventStart: apiEvent.eventStart,
    eventEnd: apiEvent.eventEnd,
    registrationStart: apiEvent.registrationStart,
    registrationEnd: apiEvent.registrationEnd,
    seatsAvailable: apiEvent.seatsAvailable,
    category: processedCategory as EventCategory,
    status: status,
    clubId: clubIdAsNumber,
  };
}

const EventStatusBadge = ({ status }: { status: EventStatus }) => {
  const { t } = useTranslation();
  const getBadgeStyles = () => {
    switch (status) {
      case "upcoming": return "bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100";
      case "ongoing": return "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100";
      case "completed": return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100";
      case "registration": return "bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-100";
      case "full": return "bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100";
      default: return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100";
    }
  };
  return (
    <View className={cn("px-2 py-1 rounded-full", getBadgeStyles())}>
      <Text className="text-xs font-medium">
        {t(`event.status.${status}`, status)}
      </Text>
    </View>
  );
};

const SeatsAvailability = ({ available, theme }: { available?: number; theme: ReturnType<typeof getTheme>; }) => {
  const { t } = useTranslation();
  if (available === undefined || available === null) return null;
  const progressValue = Math.min(100, Math.max(0, available));
  return (
    <View className="mt-2">
      <View className="flex-row justify-between mb-1 items-center">
        <View className="flex-row items-center">
          <Users size={12} className={cn("mr-1", theme.accent)} />
          <Text className="text-xs text-muted-foreground">
            {t("event.seats_remaining", { count: available })}
          </Text>
        </View>
      </View>
      <Progress value={progressValue} indicatorClassName={theme.progress} className="h-1.5 bg-muted" />
    </View>
  );
};

interface ElegantEventCardProps {
  event: ProcessedEventData;
  theme: ReturnType<typeof getTheme>;
  handlePress: () => void;
  className?: string;
}

const ElegantEventCard = ({ event, theme, handlePress, className }: ElegantEventCardProps) => {
  const { t } = useTranslation();
  return (
    <Pressable onPress={handlePress} className={cn("mb-4 overflow-hidden rounded-lg shadow-md", className)}>
      <Card className="overflow-hidden border-0 bg-card dark:bg-card-dark">
        {event.poster ? (
          <ImageBackground source={{ uri: event.poster }} className="w-full h-56" resizeMode="cover">
            <View className="w-full h-full p-4 justify-between" style={{ backgroundColor: theme.overlay }}>
              <View className="flex-row justify-between items-start">
                <View className={cn("px-2 py-1 rounded-full", theme.badge)}>
                  <Text className="text-xs font-medium text-white">
                    {t(`event.categories.${event.category}`)}
                  </Text>
                </View>
                <EventStatusBadge status={event.status} />
              </View>
              <View>
                <Text className="text-xl font-bold text-white mb-1">
                  {event.name}
                </Text>
                {event.description && (
                  <Text className="text-sm text-white opacity-90 mb-2" numberOfLines={2}>
                    {event.description}
                  </Text>
                )}
                <View className="flex-row flex-wrap items-center">
                  {event.eventStart && (
                    <View className="flex-row items-center mr-3 mb-1">
                      <Calendar size={14} color="white" className="mr-1.5" />
                      <Text className="text-xs text-white">{formatDate(event.eventStart)}</Text>
                    </View>
                  )}
                  {event.eventStart && (
                    <View className="flex-row items-center mr-3 mb-1">
                      <Clock size={14} color="white" className="mr-1.5" />
                      <Text className="text-xs text-white">{formatTime(event.eventStart)}</Text>
                    </View>
                  )}
                  {event.location && (
                    <View className="flex-row items-center mb-1">
                      <MapPin size={14} color="white" className="mr-1.5" />
                      <Text className="text-xs text-white" numberOfLines={1}>{event.location}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </ImageBackground>
        ) : (
          <View className="w-full h-56 p-4 justify-between items-center" style={{ backgroundColor: theme.overlay }}>
            <View className="absolute top-4 left-4 right-4 flex-row justify-between items-start">
              <View className={cn("px-2 py-1 rounded-full", theme.badge)}>
                <Text className="text-xs font-medium text-white">
                  {t(`event.categories.${event.category}`)}
                </Text>
              </View>
              <EventStatusBadge status={event.status} />
            </View>
            <View className="items-center">
              <Calendar size={48} color="rgba(255,255,255,0.7)" />
            </View>
            <View className="self-stretch">
              <Text className="text-xl font-bold text-white mb-1">{event.name}</Text>
              {event.description && (
                <Text className="text-sm text-white opacity-90 mb-2" numberOfLines={2}>
                  {event.description}
                </Text>
              )}
              <View className="flex-row flex-wrap items-center">
                {event.eventStart && (
                  <View className="flex-row items-center mr-3 mb-1">
                    <Calendar size={14} color="white" className="mr-1.5" />
                    <Text className="text-xs text-white">{formatDate(event.eventStart)}</Text>
                  </View>
                )}
                {event.eventStart && (
                  <View className="flex-row items-center mr-3 mb-1">
                    <Clock size={14} color="white" className="mr-1.5" />
                    <Text className="text-xs text-white">{formatTime(event.eventStart)}</Text>
                  </View>
                )}
                {event.location && (
                  <View className="flex-row items-center mb-1">
                    <MapPin size={14} color="white" className="mr-1.5" />
                    <Text className="text-xs text-white" numberOfLines={1}>{event.location}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}
        {event.seatsAvailable !== undefined && event.seatsAvailable !== null && event.status !== 'completed' && (
          <View className="p-3">
            <SeatsAvailability available={event.seatsAvailable} theme={theme} />
          </View>
        )}
      </Card>
    </Pressable>
  );
};

interface CompactEventCardProps {
  event: ProcessedEventData;
  theme: ReturnType<typeof getTheme>;
  handlePress: () => void;
  className?: string;
  imageSource: ImageSourcePropType;
}

const CompactEventCard = ({ event, theme, handlePress, className, imageSource }: CompactEventCardProps) => {
  const { t } = useTranslation();
  return (
    <Pressable onPress={handlePress} className={cn("mb-3", className)}>
      <Card className="w-full flex-row overflow-hidden border dark:border-gray-700 shadow-sm rounded-lg bg-card dark:bg-card-dark h-32">
        <Image source={imageSource} className="w-28 h-32" resizeMode="cover" />
        <View className="flex-1 p-3 justify-between">
          <View>
            <Text className="text-base font-semibold text-foreground dark:text-foreground-dark mb-1" numberOfLines={2}>
              {event.name}
            </Text>
            <View className={cn("px-1.5 py-0.5 rounded-full self-start mb-1.5", theme.badge)}>
              <Text className="text-xs font-medium text-white">
                {t(`event.categories.${event.category}`)}
              </Text>
            </View>
          </View>
          {event.eventStart && (
            <View className="flex-row items-center">
              <Calendar size={12} className={cn("mr-1", theme.accent)} />
              <Text className="text-xs text-muted-foreground dark:text-muted-foreground-dark" numberOfLines={1}>
                {formatDate(event.eventStart)} - {formatTime(event.eventStart)}
              </Text>
            </View>
          )}
        </View>
      </Card>
    </Pressable>
  );
};

export function EventCard({ event: apiEvent, variant = "elegant", className, onPress }: EventCardProps) {
  const router = useRouter();

  if (!apiEvent || typeof apiEvent.id !== 'number') {
    if (__DEV__) {
      console.warn("EventCard: Invalid or missing event data or ID. Event data:", apiEvent);
      return (
        <View className={cn("p-4 border border-red-500 rounded-md my-2 bg-red-50 dark:bg-red-900", className)}>
          <Text className="text-red-700 dark:text-red-300 font-bold">Error: Invalid Event Data</Text>
          <Text className="text-xs text-red-600 dark:text-red-400">Event ID is missing or not a number.</Text>
        </View>
      );
    }
    return null;
  }

  const event = processApiEvent(apiEvent);
  const theme = getTheme(event.category);

  const handlePress = () => {
    if (onPress) {
      console.log('onPress eventId', event.id);
      onPress(event.id);
    } else {
      console.log('push eventId2', event.id);
      router.push({ pathname: "/EventDetails", params: { id: event.id } });
    }
  };

  const defaultImage = require('~/assets/imgs/event-default.png');
  const imageSource = event.poster ? { uri: event.poster } : defaultImage;

  if (variant === "elegant") {
    return <ElegantEventCard event={event} theme={theme} handlePress={handlePress} className={className} />;
  }

  return <CompactEventCard event={event} theme={theme} handlePress={handlePress} className={className} imageSource={imageSource} />;
}
