/**
 * Utility functions for managing user sessions and authentication
 */

/**
 * Check if current user has an outlet, fetch from backend if not in localStorage
 * @param navigate - React Router navigate function
 * @returns {Promise<boolean>} - True if user has outlet, false if redirected
 */
export const requireOutlet = async (navigate: (path: string) => void): Promise<boolean> => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Debug logging
  console.log('requireOutlet - user:', user);
  console.log('requireOutlet - user id field:', user.uid || user.id);
  console.log('requireOutlet - user role:', user.role);

  // Check if user is logged in - user might have uid instead of id
  if (!user || !(user.uid || user.id)) {
    console.warn('requireOutlet - No user found, redirecting to login');
    navigate('/login');
    return false;
  }

  // Check if user is authenticated via token
  const token = localStorage.getItem('authToken');
  if (!token) {
    console.warn('requireOutlet - No auth token, redirecting to login');
    navigate('/login');
    return false;
  }

  let outlet = JSON.parse(localStorage.getItem('outlet') || '{}');
  console.log('requireOutlet - current outlet:', outlet);

  // If no outlet in localStorage, try to fetch from backend
  if (!outlet.id) {
    console.log('requireOutlet - No outlet in localStorage, fetching from backend');
    try {
      const { default: api } = await import('./api');
      const response = await api.get('/outlets/my');
      const outlets = response.data.data || [];
      console.log('requireOutlet - fetched outlets:', outlets);

      if (outlets.length > 0) {
        // Store the first outlet in localStorage
        outlet = outlets[0];
        localStorage.setItem('outlet', JSON.stringify(outlet));
        console.log('requireOutlet - stored outlet:', outlet);
      }
    } catch (error) {
      console.error('requireOutlet - Error fetching outlet:', error);
      // Don't redirect on error, just continue to create-outlet
    }
  }

  // Check if user has outlet
  if (!outlet.id) {
    console.warn('requireOutlet - No outlet found, redirecting to create-outlet');
    navigate('/create-outlet');
    return false;
  }

  console.log('requireOutlet - Success, user has outlet');
  return true;
};

/**
 * Get current user from localStorage
 * @returns {Object|null} - User object or null
 */
export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    return null;
  }
};

/**
 * Get current outlet from localStorage
 * @returns {Object|null} - Outlet object or null
 */
export const getCurrentOutlet = () => {
  try {
    return JSON.parse(localStorage.getItem('outlet') || '{}');
  } catch {
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user has valid auth token
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('authToken');
  const user = getCurrentUser();
  return !!(token && user?.id);
};