/**
 * Formats a date to a human-readable string
 * 
 * @param date The date to format
 * @param format The format to use (short, medium, long)
 * @returns A formatted date string
 */
export function formatDate(date: Date | string | number, format: 'short' | 'medium' | 'long' = 'medium'): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {};
  
  switch (format) {
    case 'short':
      options.day = 'numeric';
      options.month = 'numeric';
      options.year = '2-digit';
      break;
    case 'medium':
      options.day = 'numeric';
      options.month = 'short';
      options.year = 'numeric';
      break;
    case 'long':
      options.day = 'numeric';
      options.month = 'long';
      options.year = 'numeric';
      options.weekday = 'long';
      break;
  }
  
  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
}

/**
 * Formats a currency amount
 * 
 * @param amount The amount to format
 * @param currency The currency code (USD, EUR, etc.)
 * @returns A formatted currency string
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a phone number to a standard format
 * 
 * @param phoneNumber The phone number to format
 * @returns A formatted phone number string
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check if the input is valid
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phoneNumber;
}

/**
 * Truncates a string to a specified length
 * 
 * @param text The text to truncate
 * @param maxLength The maximum length
 * @param ellipsis Whether to add an ellipsis
 * @returns The truncated string
 */
export function truncateText(text: string, maxLength: number, ellipsis = true): string {
  if (text.length <= maxLength) {
    return text;
  }
  
  return `${text.slice(0, maxLength)}${ellipsis ? '...' : ''}`;
}

/**
 * Formats a file size in human-readable format
 * 
 * @param bytes The file size in bytes
 * @param decimals The number of decimal places
 * @returns A formatted file size string
 */
export function formatFileSize(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * Capitalizes the first letter of each word in a string
 * 
 * @param text The text to capitalize
 * @returns The capitalized string
 */
export function capitalizeWords(text: string): string {
  return text.replace(/\b\w/g, (c) => c.toUpperCase());
} 