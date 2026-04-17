/**
 * API Configuration
 * Centralized API URL management for frontend
 * 
 * Environment variable: VITE_API_URL
 * - Local development: http://localhost:3001
 * - Render production: (uses relative URLs, same domain)
 */

// Use relative URLs on production (same domain) or VITE_API_URL if provided
const getApiBaseUrl = (): string => {
  // If environment variable is set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // In production, use relative URLs (same origin)
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return ''; // Empty string = relative URLs, same domain
  }
  
  // Default to localhost for development
  return 'http://localhost:3001';
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * Helper to build full API URLs
 * @param endpoint - API endpoint (e.g., '/api/announcements')
 * @returns Full URL
 */
export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

/**
 * Helper to build asset URLs (images, documents, etc.)
 * @param path - Asset path (e.g., '/assets/uploads/image.jpg')
 * @returns Full URL
 */
export const getAssetUrl = (path: string): string => {
  if (path.startsWith('http')) return path; // Already a full URL
  if (path.startsWith('data:')) return path; // Data URL
  return `${API_BASE_URL}${path}`;
};
