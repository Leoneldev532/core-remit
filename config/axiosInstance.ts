import axios, { AxiosInstance } from "axios";
import { URL_BASE } from "../config/constant";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "",
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === "development") {
      console.log("[REQUEST]", {
        url: config.url,
        method: config.method,
      });
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Global Error Handler Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const message =
        error.response.data?.message ||
        "An unexpected error occurred from the server.";

      console.error(`[API ERROR - ${status}]`, message);

      if (status === 401) {
        console.warn(
          "Unauthorized access - handling token refresh or logout logic globally here.",
        );
      } else if (status === 403) {
        console.warn("Forbidden - User does not have privileges.");
      } else if (status >= 500) {
        console.error("Critical Server Error. Try again later.");
      }
    } else if (error.request) {
      console.error(
        "[NETWORK ERROR]",
        "No response received. Check internet connection.",
      );
    } else {
      console.error("[AXIOS SETUP ERROR]", error.message);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
