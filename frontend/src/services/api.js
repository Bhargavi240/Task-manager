const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

/**
 * Handles API fetch requests with error parsing and standard JSON response.
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      let errorMessage = 'An error occurred while processing your request.';
      if (typeof data === 'object' && data !== null) {
        if (data.detail) {
          if (Array.isArray(data.detail)) {
            // FastAPI validation errors
            errorMessage = data.detail.map((err) => `${err.loc.join('.')}: ${err.msg}`).join(', ');
          } else {
            errorMessage = data.detail;
          }
        } else if (data.message) {
          errorMessage = data.message;
        }
      } else if (typeof data === 'string' && data.length > 0) {
        errorMessage = data;
      }
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Unable to connect to the backend server. Please verify the backend is running on port 8000.');
    }
    throw error;
  }
}

export const api = {
  // Check health status
  getHealth: () => request('/health'),

  // Fetch all tasks with optional status and search filter
  getTasks: (status = null, search = '') => {
    const params = new URLSearchParams();
    if (status && status !== 'All') {
      params.append('status', status);
    }
    if (search && search.trim()) {
      params.append('search', search.trim());
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    return request(`/tasks${query}`);
  },

  // Fetch dashboard summary counts
  getStats: () => request('/tasks/stats/summary'),

  // Fetch task by ID
  getTaskById: (id) => request(`/tasks/${id}`),

  // Create a new task
  createTask: (taskData) =>
    request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    }),

  // Update existing task
  updateTask: (id, taskData) =>
    request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    }),

  // Update task status specifically
  updateTaskStatus: (id, status) =>
    request(`/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // Delete a task
  deleteTask: (id) =>
    request(`/tasks/${id}`, {
      method: 'DELETE',
    }),
};

export default api;
