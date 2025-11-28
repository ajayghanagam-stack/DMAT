// API service for backend communication

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Get backend health status
 * @returns {Promise<Object>} Health status response
 */
export const getHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching health status:', error);
    throw error;
  }
};

/**
 * Check database connection
 * @returns {Promise<Object>} Database status response
 */
export const getDbStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/db-check`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching database status:', error);
    throw error;
  }
};
