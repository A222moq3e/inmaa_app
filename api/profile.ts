import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = Constants.expoConfig?.extra?.API_URL;
// Use a fallback for development if API_URL is not defined
const FALLBACK_API_URL = 'http://10.0.2.2:5006';
const EFFECTIVE_API_URL = API_URL || FALLBACK_API_URL;

// AsyncStorage key for user profile cache
const USER_PROFILE_CACHE_KEY = 'userProfileCache';

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
  includeRelations: string = 'eventRegistration',
  forceRefresh: boolean = false
): Promise<UserProfile> => {
  try {
    // Handle case where userId might be undefined
    if (!userId) {
      throw new Error('User ID is required to fetch profile');
    }
    
    const cacheKey = `${USER_PROFILE_CACHE_KEY}_${userId}`;
    
    // Try to get profile from cache if not forcing refresh
    if (!forceRefresh) {
      const cachedProfile = await AsyncStorage.getItem(cacheKey);
      if (cachedProfile) {
        try {
          const parsedProfile = JSON.parse(cachedProfile) as UserProfile;
          return parsedProfile;
        } catch (parseError) {
          console.error('Error parsing cached profile:', parseError);
          // Continue to fetch from API if parsing fails
        }
      }
    }
    
    // If no cache or forced refresh, fetch from API
    const requestUrl = `${EFFECTIVE_API_URL}/profile?fields=${fields}&include=${includeRelations}`;
    
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
    
    // Cache the fetched profile
    await AsyncStorage.setItem(cacheKey, JSON.stringify(data.user));
    
    return data.user;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    throw error;
  }
};

// Clears cache for a specific user profile
export const clearProfileCache = async (userId: string | number): Promise<void> => {
  if (!userId) return;
  
  const cacheKey = `${USER_PROFILE_CACHE_KEY}_${userId}`;
  await AsyncStorage.removeItem(cacheKey);
};

// Clears all profile caches
export const clearAllProfileCaches = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const profileCacheKeys = keys.filter(key => key.startsWith(USER_PROFILE_CACHE_KEY));
    
    if (profileCacheKeys.length > 0) {
      await AsyncStorage.multiRemove(profileCacheKeys);
    }
  } catch (error) {
    console.error('Error clearing profile caches:', error);
  }
};
