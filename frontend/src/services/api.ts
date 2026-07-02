import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("taskforge_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auto-logout on unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Auto logout
      localStorage.removeItem("taskforge_token");
      localStorage.removeItem("taskforge_user");
      // Trigger event or reload page to redirect to landing
      window.dispatchEvent(new Event("auth_expired"));
    }
    return Promise.reject(error);
  }
);
