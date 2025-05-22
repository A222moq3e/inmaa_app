const API_URL = process.env.EXPO_PUBLIC_API_URL;
// Use a fallback for development if API_URL is not defined
const FALLBACK_API_URL = "http://10.0.2.2:5006";
const EFFECTIVE_API_URL = API_URL || FALLBACK_API_URL;

import { createAuthHeaders } from "./auth";
import i18n from "../i18n";

// Types
export interface Club {
  uuid: string;
  name: string;
  description: string;
  logo: string;
  type: string;
  status: string;
  foundingDate: string;
  createdAt: string;
  updatedAt: string;
  // Additional fields from API
  id?: number;
  isArchived?: boolean;
  archivedAt?: string | null;
  createdBy?: number;
  updatedBy?: number;
  supervisorId?: number;
}

export interface ApiResponse<T> {
  data: T;
}

export interface ClubMembership {
  uuid: string;
  clubUuid: string;
  userUuid: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClubData {
  name: string;
  description: string;
  logo: string;
  type: string;
  status: string;
  foundingDate: string;
}

export interface UpdateClubData {
  name?: string;
  description?: string;
  logo?: string;
  type?: string;
  status?: string;
}

export interface CreateMembershipData {
  userUuid: string;
  role: string;
}

export interface UpdateMembershipData {
  role?: string;
  status?: string;
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
export const getAllClubs = async (
  queryParams?: Record<string, any>
): Promise<Club[]> => {
  const headers = await createHeaders(false, false);
  const queryString = queryParams
    ? new URLSearchParams(queryParams).toString()
    : "";
  const response = await fetch(`${EFFECTIVE_API_URL}/clubs?${queryString}`, {
    headers,
  });
  if (!response.ok) throw new Error(i18n.t("errors.fetch_clubs"));

  const result: ApiResponse<Club[]> = await response.json();
  return result.data;
};

export const getClubByUuid = async (
  clubUuid: string,
  queryParams?: Record<string, any>
): Promise<Club> => {
  const headers = await createHeaders(false, false);
  const queryString = queryParams
    ? new URLSearchParams(queryParams).toString()
    : "";
  const response = await fetch(
    `${EFFECTIVE_API_URL}/clubs/${clubUuid}?${queryString}`,
    {
      headers,
    }
  );
  console.log("response", response);
  console.log("response.ok", response.ok);
  if (!response.ok) throw new Error(i18n.t("errors.fetch_club"));

  const result: ApiResponse<Club> = await response.json();
  return result.data;
};

export const createClub = async (clubData: CreateClubData): Promise<Club> => {
  const headers = await createHeaders(true);
  const response = await fetch(`${EFFECTIVE_API_URL}/clubs`, {
    method: "POST",
    headers,
    body: JSON.stringify(clubData),
  });
  if (!response.ok) throw new Error(i18n.t("errors.create_club"));

  const result: ApiResponse<Club> = await response.json();
  return result.data;
};

export const updateClub = async (
  clubUuid: string,
  clubData: UpdateClubData
): Promise<Club> => {
  const headers = await createHeaders(true);
  const response = await fetch(`${EFFECTIVE_API_URL}/clubs/${clubUuid}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(clubData),
  });
  if (!response.ok) throw new Error(i18n.t("errors.update_club"));

  const result: ApiResponse<Club> = await response.json();
  return result.data;
};

export const deleteClub = async (clubUuid: string): Promise<void> => {
  const headers = await createHeaders(true, false);
  const response = await fetch(`${EFFECTIVE_API_URL}/clubs/${clubUuid}`, {
    method: "DELETE",
    headers,
  });
  if (!response.ok) throw new Error(i18n.t("errors.delete_club"));
};

export const resetClubTerm = async (clubUuid: string): Promise<void> => {
  const headers = await createHeaders(true, false);
  const response = await fetch(
    `${EFFECTIVE_API_URL}/clubs/${clubUuid}/term-reset`,
    {
      method: "PUT",
      headers,
    }
  );
  if (!response.ok) throw new Error(i18n.t("errors.reset_term"));
};

// Membership Functions
export const getAllMemberships = async (
  clubUuid: string,
  queryParams?: Record<string, any>
): Promise<ClubMembership[]> => {
  const headers = await createHeaders(true, false);
  const queryString = queryParams
    ? new URLSearchParams(queryParams).toString()
    : "";
  const response = await fetch(
    `${EFFECTIVE_API_URL}/clubs/${clubUuid}/memberships?${queryString}`,
    {
      headers,
    }
  );
  if (!response.ok) throw new Error(i18n.t("errors.fetch_memberships"));

  const result: ApiResponse<ClubMembership[]> = await response.json();
  return result.data;
};

export const getMembershipByUuid = async (
  clubUuid: string,
  membershipUuid: string,
  queryParams?: Record<string, any>
): Promise<ClubMembership> => {
  const headers = await createHeaders(true, false);
  const queryString = queryParams
    ? new URLSearchParams(queryParams).toString()
    : "";
  const response = await fetch(
    `${EFFECTIVE_API_URL}/clubs/${clubUuid}/memberships/${membershipUuid}?${queryString}`,
    {
      headers,
    }
  );
  if (!response.ok) throw new Error(i18n.t("errors.fetch_membership"));

  const result: ApiResponse<ClubMembership> = await response.json();
  return result.data;
};

export const createMembership = async (
  clubUuid: string,
  membershipData: CreateMembershipData
): Promise<ClubMembership> => {
  const headers = await createHeaders(true);
  const response = await fetch(
    `${EFFECTIVE_API_URL}/clubs/${clubUuid}/memberships`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(membershipData),
    }
  );
  if (!response.ok) throw new Error(i18n.t("errors.create_membership"));

  const result: ApiResponse<ClubMembership> = await response.json();
  return result.data;
};

export const updateMembership = async (
  clubUuid: string,
  membershipUuid: string,
  membershipData: UpdateMembershipData
): Promise<ClubMembership> => {
  const headers = await createHeaders(true);
  const response = await fetch(
    `${EFFECTIVE_API_URL}/clubs/${clubUuid}/memberships/${membershipUuid}`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify(membershipData),
    }
  );
  if (!response.ok) throw new Error(i18n.t("errors.update_membership"));

  const result: ApiResponse<ClubMembership> = await response.json();
  return result.data;
};

export const joinClub = async (clubUuid: string): Promise<ClubMembership> => {
  const headers = await createHeaders(true, false);
  const response = await fetch(
    `${EFFECTIVE_API_URL}/clubs/${clubUuid}/memberships/me`,
    {
      method: "POST",
      headers,
    }
  );
  if (!response.ok) throw new Error(i18n.t("errors.join_club"));

  const result: ApiResponse<ClubMembership> = await response.json();
  return result.data;
};

export const leaveClub = async (clubUuid: string): Promise<void> => {
  const headers = await createHeaders(true, false);
  const response = await fetch(
    `${EFFECTIVE_API_URL}/clubs/${clubUuid}/memberships/me`,
    {
      method: "DELETE",
      headers,
    }
  );
  if (!response.ok) throw new Error(i18n.t("errors.leave_club"));
};

export const deleteMembership = async (
  clubUuid: string,
  membershipUuid: string
): Promise<void> => {
  const headers = await createHeaders(true, false);
  const response = await fetch(
    `${EFFECTIVE_API_URL}/clubs/${clubUuid}/memberships/${membershipUuid}`,
    {
      method: "DELETE",
      headers,
    }
  );
  if (!response.ok) throw new Error(i18n.t("errors.delete_membership"));
};
