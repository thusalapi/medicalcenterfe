import React, { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Report, ReportType } from "../../types";

interface ReportEditorProps {
  initialReport?: Report;
  reportType: ReportType;
  onSave: (reportData: any) => Promise<void>;
  readOnly?: boolean;
}

const ReportEditor: React.FC<ReportEditorProps> = ({
  initialReport,
  reportType,
  onSave,
  readOnly = false,
}) => {
  const [reportData, setReportData] = useState<any>(
    initialReport?.reportData || {}
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  // Get the field value from the report data
  const getFieldValue = (fieldId: string) => {
    return reportData[fieldId] || "";
  };

  // Update field value in the report data
  const updateFieldValue = (fieldId: string, value: any) => {
    if (readOnly) return;

    setReportData({
      ...reportData,
      [fieldId]: value,
    });
  };

  // Handle save
  const handleSave = async () => {
    setSaveError(null);
    setIsSaving(true);

    try {
      await onSave(reportData);
    } catch (error) {
      console.error("Error saving report:", error);
      setSaveError("Failed to save report. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Get paper dimensions
  const getPaperDimensions = () => {
    const paperSize = reportType.reportTemplate?.paperSize || "A4";

    switch (paperSize) {
      case "A4":
        return { width: 794, height: 1123 }; // A4 at 96 DPI
      case "Letter":
        return { width: 816, height: 1056 }; // US Letter at 96 DPI
      default:
        return { width: 794, height: 1123 };
    }
  };

  const paperDimensions = getPaperDimensions();

  // Setup print functionality
  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    documentTitle: `${reportType.reportName}_Report`,
  });

  // Render the appropriate input for a field
  const renderFieldInput = (field: any) => {
    const value = getFieldValue(field.id);

    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => updateFieldValue(field.id, e.target.value)}
            className="border border-gray-300 px-2 py-1 rounded"
            disabled={readOnly}
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => updateFieldValue(field.id, e.target.value)}
            className="border border-gray-300 px-2 py-1 rounded"
            disabled={readOnly}
          />
        );

      case "date":
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => updateFieldValue(field.id, e.target.value)}
            className="border border-gray-300 px-2 py-1 rounded"
            disabled={readOnly}
          />
        );

      case "checkbox":
        return (
          <input
            type="checkbox"
            checked={value === true}
            onChange={(e) => updateFieldValue(field.id, e.target.checked)}
            className="h-4 w-4"
            disabled={readOnly}
          />
        );

      case "textarea":
        return (
          <textarea
            value={value}
            onChange={(e) => updateFieldValue(field.id, e.target.value)}
            className="border border-gray-300 px-2 py-1 rounded w-full"
            rows={3}
            disabled={readOnly}
          />
        );

      case "heading":
        // Headings don't have inputs
        return null;

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => updateFieldValue(field.id, e.target.value)}
            className="border border-gray-300 px-2 py-1 rounded"
            disabled={readOnly}
          />
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {readOnly ? "Report View" : "Report Editor"}: {reportType.reportName}
        </h2>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Print Report
          </button>

          {!readOnly && (
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isSaving ? "Saving..." : "Save Report"}
            </button>
          )}
        </div>
      </div>

      {saveError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {saveError}
        </div>
      )}

      <div className="mb-6 border rounded-lg bg-gray-50 p-4 overflow-auto">
        <div
          ref={reportRef}
          className="relative bg-white mx-auto shadow-lg p-8"
          style={{
            width: `${paperDimensions.width}px`,
            height: `${paperDimensions.height}px`,
            transform: "scale(0.7)",
            transformOrigin: "top left",
          }}
        >
          {reportType.reportTemplate?.fields?.map((field: any) => (
            <div
              key={field.id}
              className="absolute"
              style={{
                left: `${field.x}px`,
                top: `${field.y}px`,
                fontSize: `${field.fontSize}px`,
                fontWeight: field.bold ? "bold" : "normal",
              }}
            >
              {field.type === "heading" ? (
                <div className={`${field.bold ? "font-bold" : "font-normal"}`}>
                  {field.label}
                </div>
              ) : (
                <div>
                  {field.showLabel && (
                    <label className="mr-2 text-gray-700">{field.label}:</label>
                  )}
                  <span className="inline-block">
                    {renderFieldInput(field)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportType.reportTemplate?.fields
          ?.filter((field: any) => field.type !== "heading")
          .map((field: any) => (
            <div key={field.id} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <div className="mt-1">{renderFieldInput(field)}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ReportEditor;
