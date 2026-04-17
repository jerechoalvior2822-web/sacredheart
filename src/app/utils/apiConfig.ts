/**
 * API Configuration
 * Centralized API URL management for frontend
 * 
 * - Local development (localhost): http://localhost:3001
 * - Render production (non-localhost): relative URLs (same domain)
 */

// Use relative URLs on production (same domain) or localhost URL in development
const getApiBaseUrl = (): string => {
  // In production (non-localhost domain), use relative URLs
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    console.log('[API Config] Production mode - Using relative URLs. Domain:', window.location.hostname);
    return ''; // Empty string = relative URLs, same domain
  }
  
  // Default to localhost for local development
  console.log('[API Config] Development mode - Using localhost:3001');
  return 'http://localhost:3001';
};

export const API_BASE_URL = getApiBaseUrl();
console.log('[API Config] API_BASE_URL set to:', API_BASE_URL || '(relative URLs)');

/**
 * Helper to build full API URLs
 * @param endpoint - API endpoint (e.g., '/api/announcements')
 * @returns Full URL
 */
export const getApiUrl = (endpoint: string): string => {
  const fullUrl = `${API_BASE_URL}${endpoint}`;
  console.log('[API Config] API Call:', fullUrl);
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
