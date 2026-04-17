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
    console.log('[API Config] Using VITE_API_URL:', import.meta.env.VITE_API_URL);
    return import.meta.env.VITE_API_URL;
  }
  
  // In production, use relative URLs (same origin)
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    console.log('[API Config] Using relative URLs (production mode)', 'hostname:', window.location.hostname);
    return ''; // Empty string = relative URLs, same domain
  }
  
  // Default to localhost for development
  console.log('[API Config] Using localhost (development mode)');
  return 'http://localhost:3001';
};

export const API_BASE_URL = getApiBaseUrl();
console.log('[API Config] API_BASE_URL:', API_BASE_URL || '(relative URLs)');

/**
 * Helper to build full API URLs
 * @param endpoint - API endpoint (e.g., '/api/announcements')
 * @returns Full URL
 */
export const getApiUrl = (endpoint: string): string => {
  const fullUrl = `${API_BASE_URL}${endpoint}`;
  console.log('[API Config] Building API URL:', { endpoint, fullUrl });
  return fullUrl;
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
