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
  reportTemplate: any;
}

export interface UpdateReportTypeRequest {
  reportName?: string;
  reportTemplate?: any;
}

export interface ReportField {
  id: string;
  label: string;
  type: string;
  x?: number;
  y?: number;
  fontSize?: number;
  bold?: boolean;
  showLabel?: boolean;
}

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
