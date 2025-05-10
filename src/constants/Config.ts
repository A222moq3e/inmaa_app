/**
 * Application configuration constants
 */

// API configuration
export const API = {
  BASE_URL: 'https://api.example.com/v1',
  TIMEOUT: 30000, // 30 seconds
  RETRY_COUNT: 3,
};

// Feature flags
export const FEATURES = {
  ENABLE_BIOMETRIC: true,
  ENABLE_PUSH_NOTIFICATIONS: true,
  ENABLE_ANALYTICS: true,
  ENABLE_CRASH_REPORTING: true,
  ENABLE_REMOTE_CONFIG: false,
};

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PROFILE: 'user_profile',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  APP_SETTINGS: 'app_settings',
  THEME_PREFERENCE: 'theme_preference',
};

// App version
export const APP_VERSION = '1.0.0';

// Default settings
export const DEFAULT_SETTINGS = {
  language: 'en',
  notifications: true,
  darkMode: false,
  dataUsage: 'wifi-only',
};

/**
 * Environment-specific configuration
 * This should be overridden by environment variables in production
 */
export const ENV = {
  IS_PRODUCTION: false,
  IS_STAGING: false,
  IS_DEVELOPMENT: true,
};

export default {
  API,
  FEATURES,
  STORAGE_KEYS,
  APP_VERSION,
  DEFAULT_SETTINGS,
  ENV,
}; 