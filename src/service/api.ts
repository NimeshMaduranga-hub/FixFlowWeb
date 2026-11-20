
import axios, {
  AxiosError,
  type InternalAxiosRequestConfig
} from "axios";

import { refreshTokenCall } from "./auth";

type RetryableRequest = InternalAxiosRequestConfig & {
  _isRefresh?: boolean;
};

// Axios Instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

// Public API Endpoints
const PUBLIC_ENDPOINT = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh"
];

// Check Public URL
const isPublicUrl = (url?: string) =>
    PUBLIC_ENDPOINT.some((endpoint) => url?.includes(endpoint));

// Request Interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ACCESS_TOKEN");

  if (token && !isPublicUrl(config.url)) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response Interceptor
api.interceptors.response.use(
    (response) => {
      return response;
    },

    async (error: AxiosError) => {
      const originalRequest = error.config as
          | RetryableRequest
          | undefined;

      if (
          originalRequest &&
          error.response?.status === 401 &&
          !originalRequest._isRefresh &&
          !isPublicUrl(originalRequest.url)
      ) {
        originalRequest._isRefresh = true;

        try {
          const refreshToken =
              localStorage.getItem("REFRESH_TOKEN");

          if (!refreshToken) {
            throw new Error("No refresh token available");
          }

          const refreshResponse =
              await refreshTokenCall(refreshToken);

          const newAccessToken: string =
              refreshResponse.data.access_token;

          if (!newAccessToken) {
            throw new Error("New access token was not received");
          }

          localStorage.setItem(
              "ACCESS_TOKEN",
              newAccessToken
          );

          originalRequest.headers.Authorization =
              `Bearer ${newAccessToken}`;

          // Retry Original Request
          return api(originalRequest);

        } catch (err) {
          localStorage.removeItem("ACCESS_TOKEN");
          localStorage.removeItem("REFRESH_TOKEN");

          window.location.href = "/login";

          console.error(err);

          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    }
);

export default api;
