import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "react-query";
import { reportTemplateAPI, patientAPI, visitAPI } from "../../utils/api";
import {
  FaFileAlt,
  FaDownload,
  FaEye,
  FaSpinner,
  FaPlus,
  FaEdit,
  FaSave,
  FaTimes,
  FaPrint,
  FaMagic,
  FaDatabase,
} from "react-icons/fa";

interface ReportGeneratorProps {
  templateId: number;
  patientId?: number;
  visitId?: number;
  onGenerated?: (reportId: number) => void;
}

interface FieldValue {
  fieldName: string;
  value: any;
  label: string;
  fieldType: string;
  dbMapping?: string;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  templateId,
  patientId,
  visitId,
  onGenerated,
}) => {
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({});
  const [reportContent, setReportContent] = useState<string>("");
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAutoFilling, setIsAutoFilling] = useState(false);

  // Fetch template details
  const { data: template, isLoading: isTemplateLoading } = useQuery(
    ["template", templateId],
    () => reportTemplateAPI.getTemplateById(templateId),
    {
      onError: () => {
        setError("Failed to load template");
      },
    }
  );

  // Fetch patient data if patientId is provided
  const { data: patientData } = useQuery(
    ["patient", patientId],
    () => (patientId ? patientAPI.getPatientById(patientId) : null),
    {
      enabled: !!patientId,
      onError: () => console.error("Failed to load patient data"),
    }
  );

  // Fetch visit data if visitId is provided
  const { data: visitData } = useQuery(
    ["visit", visitId],
    () => (visitId ? visitAPI.getVisitById(visitId) : null),
    {
      enabled: !!visitId,
      onError: () => console.error("Failed to load visit data"),
    }
  );

  // Fetch template fields
  const { data: templateFields } = useQuery(
    ["templateFields", templateId],
    () => reportTemplateAPI.getTemplateFields(templateId),
    {
      enabled: !!templateId,
      onSuccess: (fields) => {
        // Initialize field values
        const initialValues: Record<string, any> = {};
        fields.forEach((field: string) => {
          initialValues[field] = "";
        });
        setFieldValues(initialValues);
      },
      onError: () => setError("Failed to load template fields"),
    }
  );

  // Auto-fill data from database
  const autoFillData = async () => {
    if (!template || !template.dynamicFields) return;

    setIsAutoFilling(true);
    try {
      const autoFilledValues: Record<string, any> = { ...fieldValues };

      // Map database fields to form fields
      if (template.dynamicFields.fields) {
        template.dynamicFields.fields.forEach((field: any) => {
          const dbMapping = field.dbMapping || field.fieldName;

          // Auto-fill from patient data
          if (patientData && dbMapping.startsWith("patient_")) {
            const patientField = dbMapping.replace("patient_", "");
            switch (patientField) {
              case "name":
                autoFilledValues[field.fieldName] = patientData.name || "";
                break;
              case "id":
                autoFilledValues[field.fieldName] = patientData.patientId || "";
                break;
              case "age":
                autoFilledValues[field.fieldName] = patientData.age || "";
                break;
              case "gender":
                autoFilledValues[field.fieldName] = patientData.gender || "";
                break;
              case "phone":
                autoFilledValues[field.fieldName] =
                  patientData.phoneNumber || "";
                break;
              case "address":
                autoFilledValues[field.fieldName] = patientData.address || "";
                break;
            }
          }

          // Auto-fill from visit data
          if (visitData && dbMapping.startsWith("visit_")) {
            const visitField = dbMapping.replace("visit_", "");
            switch (visitField) {
              case "date":
                autoFilledValues[field.fieldName] =
                  new Date(visitData.visitDate).toLocaleDateString() || "";
                break;
              case "doctor":
                autoFilledValues[field.fieldName] = visitData.doctorName || "";
                break;
              case "notes":
                autoFilledValues[field.fieldName] = visitData.notes || "";
                break;
            }
          }

          // Auto-fill common system fields
          if (dbMapping === "test_date" || dbMapping === "report_date") {
            autoFilledValues[field.fieldName] = new Date().toLocaleDateString();
          }
        });
      }

      setFieldValues(autoFilledValues);
    } catch (error) {
      console.error("Error auto-filling data:", error);
      setError("Failed to auto-fill data from database");
    } finally {
      setIsAutoFilling(false);
    }
  };

  // Effect to auto-fill when data becomes available
  useEffect(() => {
    if (template && template.dynamicFields && (patientData || visitData)) {
      autoFillData();
    }
  }, [template, patientData, visitData]);
  const generateReportMutation = useMutation(
    () => reportTemplateAPI.generateReport(templateId, fieldValues),
    {
      onSuccess: (content) => {
        setReportContent(content);
        setError(null);
      },
      onError: () => {
        setError("Failed to generate report");
      },
    }
  );

  // Generate PDF mutation
  const generatePdfMutation = useMutation(
    () => reportTemplateAPI.generateReportPdf(templateId, fieldValues),
    {
      onSuccess: (pdfBlob) => {
        // Create download link
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${
          template?.templateName || "report"
        }_${Date.now()}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      onError: () => {
        setError("Failed to generate PDF");
      },
    }
  );

  useEffect(() => {
    // Auto-populate patient data if available
    if (patientId && template) {
      populatePatientData(patientId);
    }
  }, [patientId, template]);

  const populatePatientData = async (patientId: number) => {
    try {
      // Fetch patient data and auto-populate relevant fields
      // This would integrate with the patient API
      // const patientData = await patientAPI.getPatientById(patientId);
      // setFieldValues(prev => ({
      //   ...prev,
      //   patient_name: patientData.name,
      //   patient_phone: patientData.phoneNumber,
      //   // ... other patient fields
      // }));
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    setFieldValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleGeneratePreview = () => {
    generateReportMutation.mutate();
    setShowPreview(true);
  };

  const handleGeneratePdf = () => {
    generatePdfMutation.mutate();
  };

  const handlePrintReport = () => {
    if (reportContent) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Medical Report</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .report-content { max-width: 800px; margin: 0 auto; }
                @media print {
                  body { margin: 0; }
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              <div class="report-content">
                ${reportContent}
              </div>
              <script>
                window.onload = function() {
                  window.print();
                  window.close();
                }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    } else {
      alert("Please generate the report first");
    }
  };

  const renderFieldInput = (fieldName: string) => {
    const fieldType = getFieldType(fieldName);
    const value = fieldValues[fieldName] || "";

    switch (fieldType) {
      case "date":
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case "textarea":
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        );

      case "select":
        return (
          <select
            value={value}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select...</option>
            {getFieldOptions(fieldName).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
    }
  };

  const getFieldType = (fieldName: string): string => {
    // Extract field type from template dynamic fields
    if (template?.dynamicFields?.fields) {
      const field = template.dynamicFields.fields.find(
        (f: any) => f.fieldName === fieldName
      );
      return field?.fieldType || "text";
    }
    return "text";
  };

  const getFieldOptions = (fieldName: string): string[] => {
    // Extract field options from template dynamic fields
    if (template?.dynamicFields?.fields) {
      const field = template.dynamicFields.fields.find(
        (f: any) => f.fieldName === fieldName
      );
      return field?.options || [];
    }
    return [];
  };

  const getFieldLabel = (fieldName: string): string => {
    // Extract field label from template dynamic fields
    if (template?.dynamicFields?.fields) {
      const field = template.dynamicFields.fields.find(
        (f: any) => f.fieldName === fieldName
      );
      return (
        field?.label ||
        fieldName.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
      );
    }
    return fieldName
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (isTemplateLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <FaSpinner className="animate-spin text-blue-600 text-2xl mr-2" />
        <span className="text-gray-600">Loading template...</span>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Template not found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {template.templateName}
            </h2>
            <p className="text-sm text-gray-600 mt-1">{template.description}</p>
          </div>
          <div className="flex space-x-2">
            {(patientId || visitId) && (
              <button
                onClick={autoFillData}
                disabled={isAutoFilling}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                {isAutoFilling ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  <FaMagic className="mr-2" />
                )}
                Auto-Fill Data
              </button>
            )}
            <button
              onClick={handleGeneratePreview}
              disabled={generateReportMutation.isLoading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {generateReportMutation.isLoading ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <FaEye className="mr-2" />
              )}
              Preview
            </button>
            <button
              onClick={handlePrintReport}
              disabled={!reportContent}
              className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
            >
              <FaPrint className="mr-2" />
              Print
            </button>
            <button
              onClick={handleGeneratePdf}
              disabled={generatePdfMutation.isLoading}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {generatePdfMutation.isLoading ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <FaDownload className="mr-2" />
              )}
              Generate PDF
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Auto-fill status */}
      {(patientData || visitData) && (
        <div className="p-4 bg-blue-50 border-l-4 border-blue-500">
          <div className="flex items-center">
            <FaDatabase className="text-blue-600 mr-2" />
            <div>
              <p className="text-blue-800 font-medium">
                Database Connection Active
              </p>
              <p className="text-blue-700 text-sm">
                {patientData &&
                  `Patient: ${patientData.name} (ID: ${patientData.patientId})`}
                {patientData && visitData && " | "}
                {visitData &&
                  `Visit: ${new Date(
                    visitData.visitDate
                  ).toLocaleDateString()}`}
              </p>
            </div>
          </div>
        </div>
      )}

      <div
        className={`grid ${
          showPreview ? "grid-cols-2" : "grid-cols-1"
        } gap-6 p-6`}
      >
        {/* Fields Form */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Report Data
          </h3>
          <div className="space-y-4">
            {templateFields?.map((fieldName: string) => (
              <div key={fieldName}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {getFieldLabel(fieldName)}
                </label>
                {renderFieldInput(fieldName)}
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <div className="border border-gray-300 rounded-md p-4 bg-gray-50 min-h-96">
              {reportContent ? (
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: reportContent }}
                />
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Click "Preview" to generate report content
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportGenerator;
