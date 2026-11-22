import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for unified error formatting and 401 handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if network / connection error
    if (!error.response) {
      window.dispatchEvent(new CustomEvent('api:offline', { detail: { offline: true } }));
      return Promise.reject(new Error('Network connection failed. Please check your connection.'));
    }

    window.dispatchEvent(new CustomEvent('api:offline', { detail: { offline: false } }));

    // Extract backend error response shape
    const errorData = error.response.data || {};
    const customError = new Error(errorData.message || 'An unexpected error occurred');
    customError.status = error.response.status;
    customError.code = errorData.code;
    customError.errors = errorData.errors || [];

    return Promise.reject(customError);
  }
);
