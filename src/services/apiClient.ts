// src/services/apiClient.ts
import axios from "axios";
import { API_BASE_URL } from "@/constants/apiEndpoints";
import { useAuthStore } from "@/store/authStore";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const tokenFromStore = useAuthStore.getState().token;

    console.log(
      "[DEBUG apiClient Request Interceptor] Target URL:",
      config.url,
    );
    console.log(
      "[DEBUG apiClient Request Interceptor] Token from store:",
      tokenFromStore,
    );

    if (tokenFromStore) {
      config.headers.Authorization = `Bearer ${tokenFromStore}`;
      console.log(
        "[DEBUG apiClient Request Interceptor] Authorization header set:",
        config.headers.Authorization,
      );
    } else {
      console.log(
        "[DEBUG apiClient Request Interceptor] No token found in store. Authorization header NOT set.",
      );
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const { logoutAction, setError } = useAuthStore.getState();
      const originalRequestUrl = error.config.url;
      const isAuthEndpoint = originalRequestUrl?.includes("/auth/local");

      if (!isAuthEndpoint) {
        console.error(
          "Unauthorized access - 401. Logging out.",
          error.response,
        );
        setError("Sesi Anda telah berakhir. Silakan login kembali.");
        logoutAction();
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      } else {
        console.error(
          "Authentication failed on auth endpoint (401):",
          error.response,
        );
      }
    } else if (error.response && error.response.status === 403) {
      console.error(
        "Forbidden access - 403. URL:",
        error.config.url,
        "Response:",
        error.response,
      );
    }
    return Promise.reject(error);
  },
);

export default apiClient;
