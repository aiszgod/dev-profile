/**
 * Get the API base URL and ensure it's properly formatted
 * This prevents double /api issues
 */
export const getApiUrl = () => {
  // Get the base URL from environment variable with safe fallback
  let baseUrl = import.meta.env.VITE_API_URL;
  
  // Log for debugging
  console.log('🔍 Raw VITE_API_URL:', baseUrl);
  
  // If undefined or empty, use production URL
  if (!baseUrl || baseUrl === 'undefined' || baseUrl.trim() === '') {
    baseUrl = 'https://thenewdevprof.onrender.com';
    console.log('⚠️  VITE_API_URL not set, using production URL');
  }
  
  console.log('🔍 Base URL:', baseUrl);
  
  // Remove trailing slashes
  baseUrl = baseUrl.replace(/\/+$/, '');
  
  // Remove /api if it exists at the end
  baseUrl = baseUrl.replace(/\/api$/, '');
  
  // Add /api exactly once
  const finalUrl = `${baseUrl}/api`;
  
  console.log('✅ Final API URL:', finalUrl);
  
  return finalUrl;
};

/**
 * Get the base URL without /api (for Socket.IO connection)
 */
export const getSocketUrl = () => {
  let baseUrl = import.meta.env.VITE_API_URL;
  
  // If undefined or empty, use production URL
  if (!baseUrl || baseUrl === 'undefined' || baseUrl.trim() === '') {
    baseUrl = 'https://thenewdevprof.onrender.com';
  }
  
  // Remove trailing slashes
  baseUrl = baseUrl.replace(/\/+$/, '');
  
  // Remove /api if it exists
  baseUrl = baseUrl.replace(/\/api$/, '');
  
  console.log('🔌 Socket URL:', baseUrl);
  
  return baseUrl;
};

export default getApiUrl;