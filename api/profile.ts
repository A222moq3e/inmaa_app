import Constants from 'expo-constants';



const API_URL = Constants.expoConfig?.extra?.API_URL;
// Use a fallback for development if API_URL is not defined
const FALLBACK_API_URL = 'http://10.0.2.2:5000';
const EFFECTIVE_API_URL = API_URL || FALLBACK_API_URL;

// Types
export interface UserProfile {
  firstName: string;
  lastName: string;
  uniId: string;
  globalRole: string;
  profileImage: string;
  displayName: string;
  email: string;
  eventRegistration?: EventRegistration[];
}

export interface EventRegistration {
  id: number;
  userId: number;
  eventId: number;
  status: string;
  createdBy: number;
  updatedBy: number;
  isArchived: boolean;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileResponse {
  user: UserProfile;
}

// Create headers with user ID for authentication
const createProfileHeaders = (userId: string | number): Record<string, string> => {
  return {
    'Content-Type': 'application/json',
    'x-user-id': userId.toString()
  };
};

// Fetch user profile data
export const getUserProfile = async (
  userId: string | number,
  fields: string = 'firstName,lastName,uniId,globalRole,profileImage,displayName,email',
  includeRelations: string = 'eventRegistration'
): Promise<UserProfile> => {
  try {
    const requestUrl = `${EFFECTIVE_API_URL}/profile?fields=${fields}&include=${includeRelations}`;
    
    // Handle case where userId might be undefined
    if (!userId) {
      throw new Error('User ID is required to fetch profile');
    }
    
    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: createProfileHeaders(userId)
    });

    if (!response.ok) {
      console.error('Response not OK. Status:', response.status);
      console.error('Response status text:', response.statusText);
      throw new Error(`Failed to fetch profile: ${response.status}`);
    }

    const data = await response.json() as ProfileResponse;
    return data.user;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    throw error;
  }
};
