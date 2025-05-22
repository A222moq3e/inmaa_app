import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  getEventByUuid,
  Event,
  EventResponse,
  registerForEvent,
  unregisterFromEvent,
  getEventById,
} from "../api/EventDetails";
import { isAuthenticated } from "../api/auth";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/lib/useColorScheme";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import i18n from "../i18n";
import {
  Clock,
  Info,
  LayoutGrid,
  ListCollapse,
  MapPin,
  Users,
  Building2,
  ExternalLink,
} from "lucide-react-native";

export default function EventDetailsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isDarkColorScheme } = useColorScheme();
  const params = useLocalSearchParams<{ id: string }>();
  const eventUuid = params.id;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isEventAdmin, setIsEventAdmin] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
        setError(t("event.not_found"));
        setLoading(false);
        return;
      }

      try {
        let response;
        if (!isNaN(Number(eventUuid))) {
          response = await getEventById(Number(eventUuid));
        } else {
          response = await getEventByUuid(eventUuid);
        }
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
          throw new Error(t("event.not_found"));
        }

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("errors.generic"));
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventUuid, t]);

  // Handle refresh when user pulls down
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (!eventUuid) {
      setRefreshing(false);
      return;
    }

    try {
      let response;
      if (!isNaN(Number(eventUuid))) {
        response = await getEventById(Number(eventUuid));
      } else {
        response = await getEventByUuid(eventUuid);
      }
      
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
        throw new Error(t("event.not_found"));
      }

      setError(null);
    } catch (err) {
      // Don't update error state on refresh to keep current view
      console.error("Refresh error:", err);
    } finally {
      setRefreshing(false);
    }
  }, [eventUuid, t]);

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // Get current language from i18n
      const currentLocale = i18n.language || "en";

      return date.toLocaleDateString(currentLocale, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const handleRegistration = async () => {
    if (!event || isRegistering || !eventUuid) return;

    if (!isUserAuthenticated) {
      Alert.alert(
        t("login.required_title") || "Login Required",
        t("login.required_message") ||
          "Please login to register for this event",
        [{ text: "OK" }]
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
      setError(err instanceof Error ? err.message : t("errors.generic"));
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

  // Navigation to club details
  const navigateToClub = () => {
    if (event?.club?.uuid) {
      router.push(`/ClubDetails?uuid=${event.club.uuid}`);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" className="text-primary" />
        <Text className="mt-4 text-foreground">{t("loading")}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-background">
        <Text className="text-xl font-bold text-center text-destructive">
          {error}
        </Text>
        <Button onPress={() => router.back()} className="mt-6">
          {t("event.go_back", "Go Back")}
        </Button>
      </View>
    );
  }

  if (!event) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-background">
        <Text className="text-xl font-bold text-center text-destructive">
          {t("event.not_found")}
        </Text>
        <Button onPress={() => router.back()} className="mt-6">
          {t("event.go_back", "Go Back")}
        </Button>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
      <ScrollView
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={["#0284c7"]} // Color for Android
            tintColor={isDarkColorScheme ? "#ffffff" : "#0284c7"} // Color for iOS
            title={t("event.pull_to_refresh", "Pull to refresh")} // Only visible on iOS
            titleColor={isDarkColorScheme ? "#ffffff" : "#0284c7"} // Only visible on iOS
          />
        }
      >
        {/* Header Section */}
        <View
          className={`items-center p-6 border-b border-border ${
            isDarkColorScheme ? "bg-primary/5" : "bg-white"
          }`}
        >
          <Image
            source={
              event.poster
                ? { uri: event.poster }
                : require("../assets/imgs/event-default.png")
            }
            className="h-48 w-48 rounded-md mb-4"
            defaultSource={require("../assets/imgs/event-default.png")}
            resizeMode="cover"
          />
          <Text className="text-2xl font-bold mb-2 text-foreground text-center">
            {event.name}
          </Text>
          <View className="flex-row mt-2 flex-wrap justify-center gap-2">
            <View
              className={`px-3 py-1.5 rounded-full ${
                isEventPast(event) ? "bg-gray-500" : "bg-green-600"
              }`}
            >
              <Text className="text-xs font-medium text-white">
                {isEventPast(event) ? t("event.past") : t("event.upcoming")}
              </Text>
            </View>
            <View className="px-3 py-1.5 rounded-full bg-muted">
              <Text className="text-xs font-medium text-foreground">
                {t("event.seats_available")} {event.seatsAvailable}
              </Text>
            </View>
          </View>
        </View>

        {/* About Section */}
        <Card className="m-4 overflow-hidden">
          <View className="p-4">
            <View className="flex-row items-center mb-2">
              <Info
                size={20}
                color={isDarkColorScheme ? "#ffffff" : "#0284c7"}
              />
              <View style={{ width: 12 }} />
              <Text className="text-lg font-bold text-foreground">
                {t("event.about")}
              </Text>
            </View>
            <Text className="text-base text-foreground/80">
              {event.description}
            </Text>
          </View>
        </Card>

        {/* Details Section */}
        <Card className="m-4 overflow-hidden">
          <View className="p-4">
            <View className="flex-row items-center mb-4">
              <ListCollapse
                size={20}
                color={isDarkColorScheme ? "#ffffff" : "#0284c7"}
              />
              <View style={{ width: 12 }} />
              <Text className="text-lg font-bold text-foreground">
                {t("event.details")}
              </Text>
            </View>

            {event.category && (
              <View className="flex-row justify-between py-2 border-b border-border">
                <View className="flex-row items-center">
                  <LayoutGrid
                    size={16}
                    color={isDarkColorScheme ? "#ffffff" : "#0284c7"}
                  />
                  <View style={{ width: 8 }} />
                  <Text className="text-base font-semibold text-foreground">
                    {t("event.category")}
                  </Text>
                </View>
                <Text className="text-base text-foreground/80">
                  {t(`event.categories.${event.category?.toLowerCase()}`) ||
                    event.category}
                </Text>
              </View>
            )}

            {event.location && (
              <View className="flex-row justify-between py-2 border-b border-border">
                <View className="flex-row items-center">
                  <MapPin
                    size={16}
                    color={isDarkColorScheme ? "#ffffff" : "#0284c7"}
                  />
                  <View style={{ width: 8 }} />
                  <Text className="text-base font-semibold text-foreground">
                    {t("event.location")}
                  </Text>
                </View>
                <Text className="text-base text-foreground/80">
                  {event.location}
                </Text>
              </View>
            )}

            {event.club && (
              <View className="py-2 border-b border-border">
                <View className="flex-row justify-between mb-1">
                  <View className="flex-row items-center">
                    <Building2
                      size={16}
                      color={isDarkColorScheme ? "#ffffff" : "#0284c7"}
                    />
                    <View style={{ width: 8 }} />
                    <Text className="text-base font-semibold text-foreground">
                      {t("event.organized_by")}
                    </Text>
                  </View>
                  <Text className="text-base text-foreground/80">
                    {event.club.name}
                  </Text>
                </View>
                <Button 
                  className="mt-2" 
                  onPress={navigateToClub}
                >
                  <View className="flex-row items-center">
                    <ExternalLink 
                      size={16} 
                      className="mr-2 text-primary-foreground" 
                    />
                    <Text>{t("event.visit_club", "Visit Club")}</Text>
                  </View>
                </Button>
              </View>
            )}

            {event.seatsRemaining !== undefined && (
              <View className="flex-row justify-between py-2 border-b border-border">
                <View className="flex-row items-center">
                  <Users
                    size={16}
                    color={isDarkColorScheme ? "#ffffff" : "#0284c7"}
                  />
                  <View style={{ width: 8 }} />
                  <Text className="text-base font-semibold text-foreground">
                    {t("event.seats_remaining")}
                  </Text>
                </View>
                <Text className="text-base text-foreground/80">
                  {event.seatsRemaining}
                </Text>
              </View>
            )}

            <View className="flex-row justify-between py-2 border-b border-border">
              <View className="flex-row items-center">
                <Clock
                  size={16}
                  color={isDarkColorScheme ? "#ffffff" : "#0284c7"}
                />
                <View style={{ width: 8 }} />
                <Text className="text-base font-semibold text-foreground">
                  {t("event.start_date")}
                </Text>
              </View>
              <Text className="text-base text-foreground/80">
                {formatDate(event.eventStart)}
              </Text>
            </View>

            <View className="flex-row justify-between py-2 border-b border-border">
              <View className="flex-row items-center">
                <Clock
                  size={16}
                  color={isDarkColorScheme ? "#ffffff" : "#0284c7"}
                />
                <View style={{ width: 8 }} />
                <Text className="text-base font-semibold text-foreground">
                  {t("event.end_date")}
                </Text>
              </View>
              <Text className="text-base text-foreground/80">
                {formatDate(event.eventEnd)}
              </Text>
            </View>

            <View className="py-2">
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <Clock
                    size={16}
                    color={isDarkColorScheme ? "#ffffff" : "#0284c7"}
                  />
                  <View style={{ width: 8 }} />
                  <Text className="text-base font-semibold text-foreground">
                    {t("event.reg_period")}
                  </Text>
                </View>
                <Text className="text-base text-foreground/80">
                  {formatDate(event.registrationStart)}
                </Text>
              </View>
              <View className="flex-row justify-end py-1">
                <Text className="text-base text-foreground/80">
                  {formatDate(event.registrationEnd)}
                </Text>
              </View>
            </View>

            {/* Registration status message */}
            {isRegistrationOpen(event) && (
              <View className="mt-4 p-3 bg-green-50 rounded-md">
                <Text className="text-sm text-green-700 text-center">
                  {t("event.registration_open")}
                </Text>
              </View>
            )}

            {/* Registered status */}
            {isRegistered && (
              <View className="mt-3 p-3 bg-blue-50 rounded-md">
                <Text className="text-sm text-blue-700 text-center">
                  {t("event.you_are_registered")}
                </Text>
              </View>
            )}
          </View>
        </Card>

        {/* Admin section - only show if user is admin */}
        {isEventAdmin && (
          <Card className="m-4 overflow-hidden">
            <View className="p-4">
              <Text className="text-lg font-bold mb-2 text-foreground">
                {t("event.admin_tools")}
              </Text>
              <Text className="text-base text-foreground/80">
                {t("event.admin_message")}
              </Text>
            </View>
          </Card>
        )}

        {/* Add spacer at the bottom to account for registration button */}
        <View className="h-16" />
      </ScrollView>

      {/* Floating registration button */}
      <View className="absolute bottom-8 left-4 right-4 bg-background shadow-md rounded-lg">
        <Button
          className="w-full"
          variant={isRegistered ? "destructive" : "default"}
          disabled={
            !isRegistrationOpen(event) ||
            isEventPast(event) ||
            (event.seatsAvailable <= 0 && !isRegistered) ||
            isRegistering
          }
          onPress={handleRegistration}
        >
          <Text>
            {isRegistering
              ? t("event.processing")
              : isRegistered
              ? t("event.unregister")
              : t("event.register")}
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
