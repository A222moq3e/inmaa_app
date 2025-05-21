import Constants from "expo-constants";
const API_URL = Constants.expoConfig?.extra?.API_URL;
// Use a fallback for development if API_URL is not defined
const FALLBACK_API_URL = "http://10.0.2.2:5000";
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

// Helper to create headers with language support
const createHeaders = async (
  includeAuth = true,
  includeContentType = true
): Promise<Record<string, string>> => {
  const headers: Record<string, string> = {
    "Accept-Language": "ar", // Set Arabic as preferred language
  };

  if (includeAuth) {
    const authHeaders = await createAuthHeaders(includeContentType);
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
  try {
    const headers = await createAuthHeaders(true);

    // Get the current user ID
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.id) {
      throw new Error(i18n.t("errors.login_required"));
    }

    const response = await fetch(
      `${EFFECTIVE_API_URL}/events/${eventUuid}/register`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          userId: currentUser.id,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || i18n.t("errors.register_event"));
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const unregisterFromEvent = async (eventUuid: string): Promise<void> => {
  try {
    const headers = await createAuthHeaders(true);

    // Get the current user ID
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.id) {
      throw new Error(i18n.t("errors.login_required"));
    }

    const response = await fetch(
      `${EFFECTIVE_API_URL}/events/${eventUuid}/unregister`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          userId: currentUser.id,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || i18n.t("errors.unregister_event"));
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Alias for backward compatibility
export const getEventById = getEventByUuid;
