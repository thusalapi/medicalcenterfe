// Patient types
export interface Patient {
  patientId: number;
  phoneNumber: string;
  name: string;
  otherDetails: any; // JSON structure for flexible fields
}

export interface CreatePatientRequest {
  phoneNumber: string;
  name: string;
  otherDetails: any;
}

export interface UpdatePatientRequest {
  name?: string;
  otherDetails?: any;
}

// Visit types
export interface Visit {
  visitId: number;
  patientId: number;
  patientName: string;
  visitDate: string;
}

export interface CreateVisitRequest {
  patientId: number;
  visitDate?: string;
}

// Report types
export interface ReportType {
  reportTypeId: number;
  reportName: string;
  reportTemplate: any; // JSON structure defining the template
}

export interface CreateReportTypeRequest {
  reportName: string;
  description?: string;
  reportTemplate: any;
}

export interface UpdateReportTypeRequest {
  reportName?: string;
  reportTemplate?: any;
}

// Lab Template import types
export interface LabTemplateImportResult {
  createdCount: number;
  skippedCount: number;
  created: string[];
  skipped: string[];
}

// Report Field types for drag-and-drop template designer
export interface ReportField {
  id: string;
  type: "text" | "number" | "date" | "checkbox" | "textarea" | "heading";
  label: string;
  x: number;
  y: number;
  fontSize: number;
  bold: boolean;
  showLabel: boolean;
}

// Dynamic Field types for template system
export interface DynamicField {
  id: string;
  fieldName: string;
  fieldType: "text" | "number" | "date" | "textarea" | "select" | "checkbox";
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  position: { x: number; y: number };
  size: { width: number; height: number };
  dbMapping?: string;
}

// Static Element types for template system
export interface StaticElement {
  id: string;
  type: "text" | "heading" | "subheading" | "line" | "image" | "table";
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: {
    fontSize: number;
    fontWeight: "normal" | "bold";
    textAlign: "left" | "center" | "right";
    color: string;
    backgroundColor?: string;
  };
}

// Report Template types
export interface ReportTemplate {
  templateId: number;
  templateName: string;
  description?: string;
  category: string;
  staticContent: any;
  dynamicFields: any;
  layoutConfig: any;
  isActive: boolean;
  createdDate: string;
  lastModifiedDate?: string;
  createdBy?: string;
}

export interface CreateReportTemplateRequest {
  templateName: string;
  description?: string;
  category: string;
  staticContent: any;
  dynamicFields: any;
  layoutConfig: any;
}

export interface UpdateReportTemplateRequest {
  templateName?: string;
  description?: string;
  category?: string;
  staticContent?: any;
  dynamicFields?: any;
  layoutConfig?: any;
}

export interface GenerateReportRequest {
  fieldValues: Record<string, any>;
}

export interface ReportTemplateDTO {
  templateId: number;
  templateName: string;
  description?: string;
  category: string;
  staticContent: any;
  dynamicFields: any;
  layoutConfig: any;
  isActive: boolean;
  createdDate: string;
  lastModifiedDate?: string;
  createdBy?: string;
}

// Report types
export interface Report {
  reportId: number;
  visitId: number;
  reportTypeId: number;
  reportTypeName: string;
  reportData: any; // JSON structure with field values
  createdDate: string;
  lastModifiedDate: string;
}

export interface CreateReportRequest {
  reportTypeId: number;
  reportData: any;
}

// Bill types
export interface BillItem {
  billItemId: number;
  itemDescription: string;
  amount: number;
}

export interface Bill {
  billId: number;
  visitId: number;
  billDate: string;
  totalAmount: number;
  items: BillItem[];
}

export interface CreateBillRequest {
  visitId: number;
}

export interface CreateBillItemRequest {
  itemDescription: string;
  amount: number;
}

// Medicine Inventory types
export interface Medicine {
  medicineId: number;
  name: string;
  description?: string;
  category: string;
  unit: string;
  unitPrice: number;
  stockQuantity: number;
  batchNumber?: string;
  expiryDate?: string;
  manufacturer?: string;
  reorderLevel: number;
  createdDate: string;
  lastModifiedDate: string;
}

export interface CreateMedicineRequest {
  name: string;
  description?: string;
  category: string;
  unit: string;
  unitPrice: number;
  stockQuantity: number;
  batchNumber?: string;
  expiryDate?: string;
  manufacturer?: string;
  reorderLevel: number;
}

export interface UpdateMedicineRequest {
  name?: string;
  description?: string;
  category?: string;
  unit?: string;
  unitPrice?: number;
  stockQuantity?: number;
  batchNumber?: string;
  expiryDate?: string;
  manufacturer?: string;
  reorderLevel?: number;
}

export interface MedicineCategory {
  categoryId: number;
  name: string;
  description?: string;
}

export interface InventoryTransaction {
  transactionId: number;
  medicineId: number;
  medicineName: string;
  transactionType: "PURCHASE" | "SALE" | "ADJUSTMENT" | "RETURN" | "EXPIRED";
  quantity: number;
  transactionDate: string;
  notes?: string;
  referenceId?: string; // Can be visit ID, invoice number, etc.
}
