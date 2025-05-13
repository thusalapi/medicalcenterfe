import { api } from "./api";

export const statisticsAPI = {
  // Get comprehensive dashboard statistics
  getDashboardStats: async () => {
    const response = await api.get("/stats/dashboard");
    return response.data;
  },

  // Get visit-specific statistics (for more granular requests)
  getVisitStats: async () => {
    const response = await api.get("/visits/statistics");
    return response.data;
  },

  // Get billing-specific statistics
  getBillingStats: async () => {
    const response = await api.get("/bills/statistics");
    return response.data;
  },

  // Get report-specific statistics
  getReportStats: async () => {
    const response = await api.get("/reports/statistics");
    return response.data;
  },
};
