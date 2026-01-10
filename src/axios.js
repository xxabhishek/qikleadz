import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
});

/**
 * REQUEST INTERCEPTOR
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token expired / invalid
      localStorage.clear();
      window.location.href = "/login";
    }

    if (status === 429) {
      console.warn("⏳ Too many requests. Please wait...");
      // silent fail (no alert on live)
      return Promise.reject({
        ...error,
        handled: true,
      });
    }

    return Promise.reject(error);
  }
);

export default api;
