import axios from "axios";

// Create an axios instance with common configuration
export const api = axios.create({
  baseURL: "/api", // This will be proxied in development and points to the Spring Boot API in production
  headers: {
    "Content-Type": "application/json",
  },
});

// Patient API functions
export const patientAPI = {
  // Lookup patient by phone number
  lookupByPhone: async (phoneNumber: string) => {
    const response = await api.get(
      `/patients/lookup?phoneNumber=${encodeURIComponent(phoneNumber)}`
    );
    return response.data;
  },

  // Create new patient
  createPatient: async (patientData: any) => {
    const response = await api.post("/patients", patientData);
    return response.data;
  },

  // Update patient
  updatePatient: async (patientId: number, patientData: any) => {
    const response = await api.put(`/patients/${patientId}`, patientData);
    return response.data;
  },

  // Get patient by ID
  getPatientById: async (patientId: number) => {
    const response = await api.get(`/patients/${patientId}`);
    return response.data;
  },
};

// Visit API functions
export const visitAPI = {
  // Create new visit
  createVisit: async (visitData: any) => {
    const response = await api.post("/visits", visitData);
    return response.data;
  },

  // Get visit by ID
  getVisitById: async (visitId: number) => {
    const response = await api.get(`/visits/${visitId}`);
    return response.data;
  },

  // Get visits for patient
  getVisitsForPatient: async (patientId: number) => {
    const response = await api.get(`/visits/patient/${patientId}`);
    return response.data;
  },

  // Get recent visits (for dashboard)
  getRecentVisits: async (limit: number = 5) => {
    const response = await api.get(`/visits/recent?limit=${limit}`);
    return response.data;
  },

  // Get visit statistics for analytics dashboard
  getVisitStats: async () => {
    const response = await api.get(`/visits/statistics`);
    return response.data;
  },

  // Add report to visit
  addReportToVisit: async (visitId: number, reportData: any) => {
    const response = await api.post(`/visits/${visitId}/reports`, reportData);
    return response.data;
  },

  // Get reports for visit
  getReportsForVisit: async (visitId: number) => {
    const response = await api.get(`/visits/${visitId}/reports`);
    return response.data;
  },
};

// Report Type API functions
export const reportTypeAPI = {
  // Get all report types
  getAllReportTypes: async () => {
    const response = await api.get("/report-types");
    return response.data;
  },

  // Get report type by ID
  getReportTypeById: async (reportTypeId: number) => {
    const response = await api.get(`/report-types/${reportTypeId}`);
    return response.data;
  },

  // Create new report type
  createReportType: async (reportTypeData: any) => {
    const response = await api.post("/report-types", reportTypeData);
    return response.data;
  },

  // Update report type
  updateReportType: async (reportTypeId: number, reportTypeData: any) => {
    const response = await api.put(
      `/report-types/${reportTypeId}`,
      reportTypeData
    );
    return response.data;
  },

  // Delete report type
  deleteReportType: async (reportTypeId: number) => {
    await api.delete(`/report-types/${reportTypeId}`);
  },
};

// Report API functions
export const reportAPI = {
  // Create new report
  createReport: async (reportData: any) => {
    const response = await api.post("/reports", reportData);
    return response.data;
  },

  // Get report by ID
  getReportById: async (reportId: number) => {
    const response = await api.get(`/reports/${reportId}`);
    return response.data;
  },

  // Update report
  updateReport: async (reportId: number, reportData: any) => {
    const response = await api.put(`/reports/${reportId}`, reportData);
    return response.data;
  },

  // Delete report
  deleteReport: async (reportId: number) => {
    await api.delete(`/reports/${reportId}`);
  },

  // Get report statistics
  getReportStats: async () => {
    const response = await api.get(`/reports/statistics`);
    return response.data;
  },

  // Get reports for patient
  getReportsForPatient: async (patientId: number) => {
    const response = await api.get(`/reports/patient/${patientId}`);
    return response.data;
  },

  // Get reports for visit
  getReportsForVisit: async (visitId: number) => {
    const response = await api.get(`/reports/visit/${visitId}`);
    return response.data;
  },

  // Generate PDF for report
  generateReportPdf: async (reportId: number) => {
    const response = await api.get(`/reports/${reportId}/pdf`, {
      responseType: "blob",
    });
    return response.data;
  },
};

// Bill API functions
export const billAPI = {
  // Create new bill
  createBill: async (billData: any) => {
    const response = await api.post("/bills", billData);
    return response.data;
  },

  // Get bill by ID
  getBillById: async (billId: number) => {
    const response = await api.get(`/bills/${billId}`);
    return response.data;
  },

  // Get bill by visit ID
  getBillByVisitId: async (visitId: number) => {
    const response = await api.get(`/bills/visit/${visitId}`);
    return response.data;
  },

  // Get billing statistics
  getBillingStats: async () => {
    const response = await api.get(`/bills/statistics`);
    return response.data;
  },

  // Add item to bill
  addItemToBill: async (billId: number, itemData: any) => {
    const response = await api.post(`/bills/${billId}/items`, itemData);
    return response.data;
  },

  // Get bill items
  getBillItems: async (billId: number) => {
    const response = await api.get(`/bills/${billId}/items`);
    return response.data;
  },

  // Remove bill item
  removeBillItem: async (billId: number, itemId: number) => {
    await api.delete(`/bills/${billId}/items/${itemId}`);
  },

  // Recalculate bill total
  recalculateBillTotal: async (billId: number) => {
    const response = await api.put(`/bills/${billId}/recalculate`);
    return response.data;
  },

  // Generate PDF for bill
  generateBillPdf: async (billId: number) => {
    const response = await api.get(`/bills/${billId}/pdf`, {
      responseType: "blob",
    });
    return response.data;
  },
};
