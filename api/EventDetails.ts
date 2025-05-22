const API_URL = process.env.EXPO_PUBLIC_API_URL;
// Use a fallback for development if API_URL is not defined
const FALLBACK_API_URL = "http://10.0.2.2:5006";
const EFFECTIVE_API_URL = API_URL || FALLBACK_API_URL;

import { createAuthHeaders, getCurrentUser } from "./auth";
import i18n from "../i18n";

// Types
export interface Event {
  uuid: string;
  id?: number;
  name: string;
  description: string;
  seatsAvailable: number;
  seatsRemaining?: number;
  clubId: string;
  registrationStart: string;
  registrationEnd: string;
  eventStart: string;
  eventEnd: string;
  createdAt: string;
  updatedAt: string;
  // Additional fields from API
  isArchived?: boolean;
  archivedAt?: string | null;
  createdBy?: number;
  updatedBy?: number;
  image?: string;
  poster?: string;
  category?: string;
  location?: string;
  status?: string;
  club?: {
    name: string;
    uuid: string;
    logo?: string;
  };
}

export interface RegisteredUser {
  uuid: string;
  // Add other user properties as needed
}

// Updated to handle both response formats
export interface EventResponse {
  // Direct format (original format)
  event?: Event;
  isRegistered?: boolean;
  isEventAdmin?: boolean;

  // Nested format (what the API actually returns)
  data?: {
    event: Event;
    registeredUsersData: RegisteredUser[];
  };
  success?: boolean;
}

export interface ApiResponse<T> {
  data: T;
}

export interface CreateEventData {
  name: string;
  description: string;
  seatsAvailable: number;
  clubId: string;
  registrationStart: string;
  registrationEnd: string;
  eventStart: string;
  eventEnd: string;
}

export interface UpdateEventData {
  name?: string;
  description?: string;
  seatsAvailable?: number;
  registrationStart?: string;
  registrationEnd?: string;
  eventStart?: string;
  eventEnd?: string;
}

// Helper to create headers with language support and user ID
const createHeaders = async (
  includeAuth = true,
  includeContentType = true
): Promise<Record<string, string>> => {
  const headers: Record<string, string> = {
    "Accept-Language": "ar", // Set Arabic as preferred language
  };

  if (includeAuth) {
    const authHeaders = await createAuthHeaders(includeContentType);

    // Get current user to set x-user-id header
    const user = await getCurrentUser();
    if (user && (user.id || user.uuid)) {
      const userId = user.id || user.uuid;
      // Ensure userId is a string before setting the header
      headers["x-user-id"] = String(userId);
    }

    return { ...headers, ...authHeaders };
  }

  if (includeContentType) {
    headers["Content-Type"] = "application/json; charset=UTF-8";
  }

  return headers;
};

// API Functions
export const getAllEvents = async (
  queryParams?: Record<string, any>
): Promise<Event[]> => {
  const headers = await createHeaders(false, false);
  const queryString = queryParams
    ? new URLSearchParams(queryParams).toString()
    : "";
  const response = await fetch(`${EFFECTIVE_API_URL}/events?${queryString}`, {
    headers,
  });
  if (!response.ok) throw new Error(i18n.t("errors.fetch_events"));

  const result: ApiResponse<Event[]> = await response.json();
  return result.data;
};

export const getEventById = async (
  eventId: number,
  queryParams?: Record<string, any>
): Promise<EventResponse> => {
  const headers = await createHeaders(false, false);
  const queryString = queryParams
    ? new URLSearchParams(queryParams).toString()
    : "";

  const response = await fetch(
    `${EFFECTIVE_API_URL}/events/${eventId}?${queryString}`,
    {
      headers,
    }
  );

  if (!response.ok) throw new Error(i18n.t("errors.fetch_event"));

  return await response.json();
};

export const getEventByUuid = async (
  eventUuid: string,
  queryParams?: Record<string, any>
): Promise<EventResponse> => {
  const headers = await createHeaders(false, false);
  const queryString = queryParams
    ? new URLSearchParams(queryParams).toString()
    : "";

  const response = await fetch(
    `${EFFECTIVE_API_URL}/events/${eventUuid}?${queryString}`,
    {
      headers,
    }
  );

  if (!response.ok) throw new Error(i18n.t("errors.fetch_event"));

  return await response.json();
};

export const createEvent = async (
  eventData: CreateEventData
): Promise<Event> => {
  const headers = await createHeaders(true);
  const response = await fetch(`${EFFECTIVE_API_URL}/events`, {
    method: "POST",
    headers,
    body: JSON.stringify(eventData),
  });
  if (!response.ok) throw new Error(i18n.t("errors.create_event"));

  const result: ApiResponse<Event> = await response.json();
  return result.data;
};

export const updateEvent = async (
  eventUuid: string,
  eventData: UpdateEventData
): Promise<Event> => {
  const headers = await createHeaders(true);
  const response = await fetch(`${EFFECTIVE_API_URL}/events/${eventUuid}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(eventData),
  });
  if (!response.ok) throw new Error(i18n.t("errors.update_event"));

  const result: ApiResponse<Event> = await response.json();
  return result.data;
};

export const deleteEvent = async (eventUuid: string): Promise<void> => {
  const headers = await createHeaders(true, false);
  const response = await fetch(`${EFFECTIVE_API_URL}/events/${eventUuid}`, {
    method: "DELETE",
    headers,
  });
  if (!response.ok) throw new Error(i18n.t("errors.delete_event"));
};

export const registerForEvent = async (eventUuid: string): Promise<void> => {
  const headers = await createHeaders(true, true);

  const response = await fetch(
    `${EFFECTIVE_API_URL}/events/${eventUuid}/register`,
    {
      method: "POST",
      headers,
      // No body needed - user is identified by the auth token and x-user-id header
    }
  );
  if (!response.ok) throw new Error(i18n.t("errors.register_event"));
};

export const unregisterFromEvent = async (eventUuid: string): Promise<void> => {
  const headers = await createHeaders(true, true);

  const response = await fetch(
    `${EFFECTIVE_API_URL}/events/${eventUuid}/unregister`,
    {
      method: "POST",
      headers,
      // No body needed - user is identified by the auth token and x-user-id header
    }
  );
  if (!response.ok) throw new Error(i18n.t("errors.unregister_event"));
};
