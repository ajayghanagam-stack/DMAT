// API service for backend communication

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `HTTP error! status: ${response.status}`
    }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to make authenticated requests
const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  return handleResponse(response);
};

/**
 * Get backend health status
 */
export const getHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching health status:', error);
    throw error;
  }
};

/**
 * Check database connection
 */
export const getDbStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/db-check`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching database status:', error);
    throw error;
  }
};

// ============================================================================
// AUTHENTICATION APIs
// ============================================================================

/**
 * Login user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} { token, user }
 */
export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await handleResponse(response);

  // Store token in localStorage
  if (data.data && data.data.token) {
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }

  return data.data;
};

/**
 * Verify current token
 */
export const verifyToken = async () => {
  return await fetchWithAuth('/api/auth/verify');
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// ============================================================================
// LANDING PAGES APIs
// ============================================================================

/**
 * Get all landing pages
 * @param {Object} params - Query parameters (status, search, page, limit)
 */
export const getLandingPages = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `/api/admin/landing-pages${queryString ? `?${queryString}` : ''}`;
  return await fetchWithAuth(url);
};

/**
 * Get single landing page by ID
 * @param {number} id
 */
export const getLandingPage = async (id) => {
  return await fetchWithAuth(`/api/admin/landing-pages/${id}`);
};

/**
 * Create new landing page
 * @param {Object} data - Landing page data
 */
export const createLandingPage = async (data) => {
  return await fetchWithAuth('/api/admin/landing-pages', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Update landing page
 * @param {number} id
 * @param {Object} data - Updated landing page data
 */
export const updateLandingPage = async (id, data) => {
  return await fetchWithAuth(`/api/admin/landing-pages/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * Publish landing page
 * @param {number} id
 */
export const publishLandingPage = async (id) => {
  return await fetchWithAuth(`/api/admin/landing-pages/${id}/publish`, {
    method: 'POST',
  });
};

/**
 * Delete landing page
 * @param {number} id
 */
export const deleteLandingPage = async (id) => {
  return await fetchWithAuth(`/api/admin/landing-pages/${id}`, {
    method: 'DELETE',
  });
};

/**
 * Get landing page preview
 * @param {number} id
 */
export const getPreview = async (id) => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/admin/landing-pages/${id}/preview`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.text(); // Returns HTML
};

/**
 * Get landing page stats
 */
export const getLandingPageStats = async () => {
  return await fetchWithAuth('/api/admin/landing-pages/stats');
};

// ============================================================================
// LEADS APIs
// ============================================================================

/**
 * Get all leads
 * @param {Object} params - Query parameters (status, search, page, limit, landingPageId)
 */
export const getLeads = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `/api/admin/leads${queryString ? `?${queryString}` : ''}`;
  return await fetchWithAuth(url);
};

/**
 * Get single lead by ID
 * @param {number} id
 */
export const getLead = async (id) => {
  return await fetchWithAuth(`/api/admin/leads/${id}`);
};

/**
 * Update lead status
 * @param {number} id
 * @param {string} status - One of: new, contacted, qualified, converted
 */
export const updateLeadStatus = async (id, status) => {
  return await fetchWithAuth(`/api/admin/leads/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};

/**
 * Export leads to CSV
 * @param {Object} params - Query parameters (status, search, landingPageId)
 */
export const exportLeads = async (params = {}) => {
  const token = getAuthToken();
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/api/admin/leads/export${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Return the blob for download
  return await response.blob();
};

/**
 * Assign lead to user
 * @param {number} id - Lead ID
 * @param {number|null} assigned_to - User ID to assign to (null to unassign)
 */
export const assignLead = async (id, assigned_to) => {
  return await fetchWithAuth(`/api/admin/leads/${id}/assign`, {
    method: 'PATCH',
    body: JSON.stringify({ assigned_to }),
  });
};

/**
 * Get all notes for a lead
 * @param {number} id - Lead ID
 */
export const getLeadNotes = async (id) => {
  return await fetchWithAuth(`/api/admin/leads/${id}/notes`);
};

/**
 * Create a new note for a lead
 * @param {number} id - Lead ID
 * @param {string} note_text - Note content
 */
export const createLeadNote = async (id, note_text) => {
  return await fetchWithAuth(`/api/admin/leads/${id}/notes`, {
    method: 'POST',
    body: JSON.stringify({ note_text }),
  });
};

/**
 * Delete a lead note
 * @param {number} noteId - Note ID
 */
export const deleteLeadNote = async (noteId) => {
  return await fetchWithAuth(`/api/admin/leads/notes/${noteId}`, {
    method: 'DELETE',
  });
};

/**
 * Submit lead (public endpoint - no auth required)
 * @param {Object} data - Lead data
 */
export const submitLead = async (data) => {
  const response = await fetch(`${API_BASE_URL}/api/public/leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleResponse(response);
};

// ============================================================================
// USERS APIs
// ============================================================================

/**
 * Get all users
 */
export const getUsers = async () => {
  return await fetchWithAuth('/api/admin/users');
};

/**
 * Get single user by ID
 * @param {number} id
 */
export const getUser = async (id) => {
  return await fetchWithAuth(`/api/admin/users/${id}`);
};

/**
 * Create new user
 * @param {Object} data - User data (name, email, password, role)
 */
export const createUser = async (data) => {
  return await fetchWithAuth('/api/admin/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Update user
 * @param {number} id
 * @param {Object} data - Updated user data (name, email, role)
 */
export const updateUser = async (id, data) => {
  return await fetchWithAuth(`/api/admin/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * Delete user
 * @param {number} id
 */
export const deleteUser = async (id) => {
  return await fetchWithAuth(`/api/admin/users/${id}`, {
    method: 'DELETE',
  });
};

// ============================================================================
// ANALYTICS APIs
// ============================================================================

/**
 * Get dashboard analytics data
 */
export const getDashboardAnalytics = async () => {
  return await fetchWithAuth('/api/admin/analytics/dashboard');
};

// ============================================================================
// TEMPLATES APIs
// ============================================================================

/**
 * Get all active templates
 */
export const getTemplates = async () => {
  return await fetchWithAuth('/api/admin/templates');
};

/**
 * Get single template by ID
 * @param {number} id
 */
export const getTemplate = async (id) => {
  return await fetchWithAuth(`/api/admin/templates/${id}`);
};

// ============================================================================
// IMAGE UPLOAD APIs
// ============================================================================

/**
 * Upload image to MinIO storage
 * @param {File} imageFile - Image file to upload
 * @returns {Promise<Object>} - {url, filename, size, mimeType}
 */
export const uploadImage = async (imageFile) => {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch(`${API_BASE_URL}/api/admin/upload/image`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData, // Don't set Content-Type - browser will set it with boundary
  });

  return handleResponse(response);
};

/**
 * Delete image from MinIO storage
 * @param {string} imageUrl - URL of the image to delete
 */
export const deleteImage = async (imageUrl) => {
  return await fetchWithAuth('/api/admin/upload/image', {
    method: 'DELETE',
    body: JSON.stringify({ url: imageUrl }),
  });
};
