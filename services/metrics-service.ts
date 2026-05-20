import axiosInstance from "../config/axiosInstance";

export const metricsService = {
  trackAbandonment: async (): Promise<void> => {
    await axiosInstance.post("/api/metrics");
  },
};
