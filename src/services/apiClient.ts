import { Platform } from 'react-native';

/**
 * Base URL for API requests
 */
const API_URL = 'https://api.example.com/v1';

/**
 * Default request headers
 */
const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Platform': Platform.OS,
};

/**
 * API request options type
 */
interface RequestOptions {
  headers?: Record<string, string>;
  authToken?: string;
  params?: Record<string, string | number | boolean>;
}

/**
 * API response with generic data type
 */
interface ApiResponse<T> {
  data: T;
  status: number;
  success: boolean;
  message?: string;
}

/**
 * Type for request data
 */
type RequestData = Record<string, unknown>;

/**
 * Creates a query string from params object
 */
const createQueryString = (params: Record<string, string | number | boolean>): string => {
  return Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(String(params[key]))}`)
    .join('&');
};

/**
 * Handles API request with error handling and response parsing
 */
const request = async <T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  data?: RequestData,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> => {
  try {
    const { headers = {}, authToken, params } = options;
    
    // Prepare URL with query params if needed
    let url = `${API_URL}${endpoint}`;
    if (params && Object.keys(params).length > 0) {
      url += `?${createQueryString(params)}`;
    }
    
    // Prepare headers
    const requestHeaders: Record<string, string> = {
      ...defaultHeaders,
      ...headers,
    };
    
    // Add auth token if provided
    if (authToken) {
      requestHeaders['Authorization'] = `Bearer ${authToken}`;
    }
    
    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
    };
    
    // Add body data for non-GET requests
    if (method !== 'GET' && data) {
      requestOptions.body = JSON.stringify(data);
    }
    
    // Make the request
    const response = await fetch(url, requestOptions);
    
    // Parse the response
    const responseData = await response.json();
    
    return {
      data: responseData,
      status: response.status,
      success: response.ok,
      message: response.ok ? 'Success' : responseData.message || response.statusText,
    };
  } catch (error) {
    return {
      data: null as unknown as T,
      status: 0,
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

/**
 * API client with methods for different HTTP verbs
 */
const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) => 
    request<T>(endpoint, 'GET', undefined, options),
    
  post: <T>(endpoint: string, data: RequestData, options?: RequestOptions) => 
    request<T>(endpoint, 'POST', data, options),
    
  put: <T>(endpoint: string, data: RequestData, options?: RequestOptions) => 
    request<T>(endpoint, 'PUT', data, options),
    
  patch: <T>(endpoint: string, data: RequestData, options?: RequestOptions) => 
    request<T>(endpoint, 'PATCH', data, options),
    
  delete: <T>(endpoint: string, options?: RequestOptions) => 
    request<T>(endpoint, 'DELETE', undefined, options),
};

export default apiClient; 