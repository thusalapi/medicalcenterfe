import axios from "axios";

// Determine the base URL for API requests
const getBaseUrl = () => {
  // If running in the browser, point directly to the backend
  if (typeof window !== "undefined") {
    return "http://localhost:8080/api"; // Add back the /api prefix
  }

  // If running on server during SSR, use the relative path which will be proxied
  return "/api";
};

// Create an axios instance with common configuration
export const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Patient API functions
export const patientAPI = {
  // Lookup patient by phone number
  lookupByPhone: async (phoneNumber: string) => {
    try {
      console.log(`Looking up patient with phone number: ${phoneNumber}`);
      const response = await api.get(
        `/patients/lookup?phoneNumber=${encodeURIComponent(phoneNumber)}`
      );
      console.log("Patient lookup response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error looking up patient:", error);
      if ((error as any).response?.status === 404) {
        // If patient not found, return null instead of throwing error
        return null;
      }
      throw error;
    }
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

  // Get all patients with optional search
  getAllPatients: async (
    searchTerm?: string,
    page?: number,
    limit?: number
  ) => {
    let url = "/patients";
    const params = [];

    if (searchTerm) params.push(`search=${encodeURIComponent(searchTerm)}`);
    if (page) params.push(`page=${page}`);
    if (limit) params.push(`limit=${limit}`);

    if (params.length > 0) {
      url += "?" + params.join("&");
    }

    const response = await api.get(url);
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

  // Get all visits with optional search and pagination
  getAllVisits: async (
    searchTerm?: string,
    dateFrom?: string,
    dateTo?: string,
    page?: number,
    limit?: number
  ) => {
    let url = "/visits";
    const params = [];

    if (searchTerm) params.push(`search=${encodeURIComponent(searchTerm)}`);
    if (dateFrom) params.push(`dateFrom=${dateFrom}`);
    if (dateTo) params.push(`dateTo=${dateTo}`);
    if (page) params.push(`page=${page}`);
    if (limit) params.push(`limit=${limit}`);

    if (params.length > 0) {
      url += "?" + params.join("&");
    }

    const response = await api.get(url);
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
  }, // Create new report type
  createReportType: async (reportTypeData: any) => {
    console.log(
      "Sending report type data to API:",
      JSON.stringify(reportTypeData, null, 2)
    );
    try {
      const response = await api.post("/report-types", reportTypeData);
      return response.data;
    } catch (error) {
      console.error("Error creating report type:", error);
      throw error;
    }
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

  // Import predefined lab templates
  importPredefinedLabTemplates: async () => {
    const response = await api.post("/lab-templates/import-predefined");
    return response.data;
  },

  // Create custom lab templates
  createCustomLabTemplates: async (templateNames: string[]) => {
    const response = await api.post(
      "/lab-templates/create-custom",
      templateNames
    );
    return response.data;
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

  // Get all bills with optional search and pagination
  getAllBills: async (
    searchTerm?: string,
    dateFrom?: string,
    dateTo?: string,
    status?: string,
    page?: number,
    limit?: number
  ) => {
    let url = "/bills";
    const params = [];

    if (searchTerm) params.push(`search=${encodeURIComponent(searchTerm)}`);
    if (dateFrom) params.push(`dateFrom=${dateFrom}`);
    if (dateTo) params.push(`dateTo=${dateTo}`);
    if (status) params.push(`status=${encodeURIComponent(status)}`);
    if (page) params.push(`page=${page}`);
    if (limit) params.push(`limit=${limit}`);

    if (params.length > 0) {
      url += "?" + params.join("&");
    }

    const response = await api.get(url);
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

// Medicine Inventory API functions
export const medicineAPI = {
  // Get all medicines
  getAllMedicines: async () => {
    const response = await api.get("/medicines");
    return response.data;
  },

  // Get medicine by ID
  getMedicineById: async (medicineId: number) => {
    const response = await api.get(`/medicines/${medicineId}`);
    return response.data;
  },

  // Create new medicine
  createMedicine: async (medicineData: any) => {
    const response = await api.post("/medicines", medicineData);
    return response.data;
  },

  // Update medicine
  updateMedicine: async (medicineId: number, medicineData: any) => {
    const response = await api.put(`/medicines/${medicineId}`, medicineData);
    return response.data;
  },

  // Delete medicine
  deleteMedicine: async (medicineId: number) => {
    await api.delete(`/medicines/${medicineId}`);
  },

  // Search medicines
  searchMedicines: async (query: string) => {
    const response = await api.get(
      `/medicines/search?query=${encodeURIComponent(query)}`
    );
    return response.data;
  },

  // Get low stock medicines
  getLowStockMedicines: async () => {
    const response = await api.get("/medicines/low-stock");
    return response.data;
  },

  // Get expiring medicines
  getExpiringMedicines: async (daysThreshold: number = 30) => {
    const response = await api.get(`/medicines/expiring?days=${daysThreshold}`);
    return response.data;
  },

  // Get medicine categories
  getMedicineCategories: async () => {
    const response = await api.get("/medicine-categories");
    return response.data;
  },

  // Create medicine category
  createMedicineCategory: async (categoryData: any) => {
    const response = await api.post("/medicine-categories", categoryData);
    return response.data;
  },

  // Record inventory transaction
  recordInventoryTransaction: async (transactionData: any) => {
    const response = await api.post("/inventory-transactions", transactionData);
    return response.data;
  },

  // Get inventory transactions
  getInventoryTransactions: async (
    medicineId?: number,
    startDate?: string,
    endDate?: string
  ) => {
    let url = "/inventory-transactions";
    const params = [];

    if (medicineId) params.push(`medicineId=${medicineId}`);
    if (startDate) params.push(`startDate=${startDate}`);
    if (endDate) params.push(`endDate=${endDate}`);

    if (params.length > 0) {
      url += "?" + params.join("&");
    }

    const response = await api.get(url);
    return response.data;
  },

  // Generate inventory report
  generateInventoryReport: async (
    startDate?: string,
    endDate?: string,
    category?: string
  ) => {
    let url = "/inventory-reports";
    const params = [];

    if (startDate) params.push(`startDate=${startDate}`);
    if (endDate) params.push(`endDate=${endDate}`);
    if (category) params.push(`category=${encodeURIComponent(category)}`);

    if (params.length > 0) {
      url += "?" + params.join("&");
    }

    const response = await api.get(url, {
      responseType: "blob",
    });
    return response.data;
  },

  // Get inventory statistics
  getInventoryStats: async () => {
    const response = await api.get("/inventory-statistics");
    return response.data;
  },
};
