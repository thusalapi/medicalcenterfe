import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Link from "next/link";
import Head from "next/head";
import {
  FaArrowLeft,
  FaUpload,
  FaFileAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTrash,
  FaEye,
  FaDownload,
} from "react-icons/fa";

interface UploadedTemplate {
  id: string;
  file: File;
  name: string;
  category: string;
  description: string;
  status: "pending" | "valid" | "invalid" | "uploaded";
  errors?: string[];
  previewData?: any;
}

const TemplateUploadPage: React.FC = () => {
  const [uploadedTemplates, setUploadedTemplates] = useState<
    UploadedTemplate[]
  >([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/json": [".json"],
      "text/plain": [".txt"],
    },
    multiple: true,
    onDrop: useCallback((acceptedFiles: File[]) => {
      const newTemplates: UploadedTemplate[] = acceptedFiles.map(
        (file, index) => ({
          id: `template-${Date.now()}-${index}`,
          file,
          name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
          category: "GENERAL_REPORT",
          description: "",
          status: "pending",
        })
      );

      setUploadedTemplates((prev) => [...prev, ...newTemplates]);
      processTemplates(newTemplates);
    }, []),
  });

  const processTemplates = async (templates: UploadedTemplate[]) => {
    setIsProcessing(true);

    for (let i = 0; i < templates.length; i++) {
      const template = templates[i];

      try {
        const fileContent = await readFileContent(template.file);
        const validationResult = validateTemplateContent(fileContent);

        setUploadedTemplates((prev) =>
          prev.map((t) =>
            t.id === template.id
              ? {
                  ...t,
                  status: validationResult.isValid ? "valid" : "invalid",
                  errors: validationResult.errors,
                  previewData: validationResult.previewData,
                }
              : t
          )
        );

        setUploadProgress(((i + 1) / templates.length) * 100);
      } catch (error) {
        setUploadedTemplates((prev) =>
          prev.map((t) =>
            t.id === template.id
              ? {
                  ...t,
                  status: "invalid",
                  errors: ["Failed to read file content"],
                }
              : t
          )
        );
      }
    }

    setIsProcessing(false);
    setUploadProgress(0);
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const validateTemplateContent = (content: string) => {
    const errors: string[] = [];
    let previewData = null;

    try {
      const parsed = JSON.parse(content);

      // Check required fields
      if (!parsed.templateName) {
        errors.push("Template name is required");
      }

      if (!parsed.category) {
        errors.push("Template category is required");
      }

      if (!parsed.staticContent && !parsed.dynamicFields) {
        errors.push(
          "Template must have either static content or dynamic fields"
        );
      }

      // Validate dynamic fields
      if (parsed.dynamicFields?.fields) {
        parsed.dynamicFields.fields.forEach((field: any, index: number) => {
          if (!field.fieldName) {
            errors.push(`Dynamic field ${index + 1}: fieldName is required`);
          }
          if (!field.fieldType) {
            errors.push(`Dynamic field ${index + 1}: fieldType is required`);
          }
          if (!field.dataMapping) {
            errors.push(`Dynamic field ${index + 1}: dataMapping is required`);
          }
        });
      }

      // Generate preview data
      previewData = {
        templateName: parsed.templateName,
        category: parsed.category,
        staticElementsCount: parsed.staticContent?.elements?.length || 0,
        dynamicFieldsCount: parsed.dynamicFields?.fields?.length || 0,
        fields:
          parsed.dynamicFields?.fields?.map((field: any) => ({
            label: field.label,
            type: field.fieldType,
            mapping: field.dataMapping,
          })) || [],
      };
    } catch (e) {
      errors.push("Invalid JSON format");
    }

    return {
      isValid: errors.length === 0,
      errors,
      previewData,
    };
  };

  const updateTemplate = (id: string, updates: Partial<UploadedTemplate>) => {
    setUploadedTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const removeTemplate = (id: string) => {
    setUploadedTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const handleBulkUpload = async () => {
    const validTemplates = uploadedTemplates.filter(
      (t) => t.status === "valid"
    );

    if (validTemplates.length === 0) {
      alert("No valid templates to upload");
      return;
    }

    setIsProcessing(true);

    try {
      // Here you would actually upload to your API
      for (let i = 0; i < validTemplates.length; i++) {
        const template = validTemplates[i];

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        updateTemplate(template.id, { status: "uploaded" });
        setUploadProgress(((i + 1) / validTemplates.length) * 100);
      }

      alert(`Successfully uploaded ${validTemplates.length} templates!`);
    } catch (error) {
      alert("Error uploading templates");
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  const downloadSampleTemplate = () => {
    const sampleTemplate = {
      templateName: "Sample Blood Test Report",
      description: "A sample blood test report template",
      category: "BLOOD_TEST",
      staticContent: {
        elements: [
          {
            id: "title-1",
            type: "text",
            content: "BLOOD TEST REPORT",
            position: { x: 100, y: 50 },
            size: { width: 400, height: 40 },
            style: {
              fontSize: 24,
              fontWeight: "bold",
              textAlign: "center",
              color: "#333333",
            },
          },
          {
            id: "header-1",
            type: "text",
            content: "Patient Information",
            position: { x: 50, y: 120 },
            size: { width: 200, height: 30 },
            style: {
              fontSize: 16,
              fontWeight: "bold",
              textAlign: "left",
              color: "#666666",
            },
          },
        ],
      },
      dynamicFields: {
        fields: [
          {
            id: "patient-name",
            fieldName: "patient_name",
            fieldType: "text",
            label: "Patient Name",
            required: true,
            position: { x: 250, y: 120 },
            size: { width: 200, height: 30 },
            dataMapping: "patient.name",
          },
          {
            id: "test-date",
            fieldName: "test_date",
            fieldType: "date",
            label: "Test Date",
            required: true,
            position: { x: 250, y: 160 },
            size: { width: 200, height: 30 },
            dataMapping: "report.date",
          },
          {
            id: "hemoglobin",
            fieldName: "hemoglobin",
            fieldType: "number",
            label: "Hemoglobin (g/dL)",
            required: false,
            position: { x: 250, y: 200 },
            size: { width: 200, height: 30 },
            dataMapping: "lab.hemoglobin",
          },
        ],
        mappings: {
          patient_name: "patient.name",
          test_date: "report.date",
          hemoglobin: "lab.hemoglobin",
        },
      },
    };

    const blob = new Blob([JSON.stringify(sampleTemplate, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample-blood-test-template.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const validTemplatesCount = uploadedTemplates.filter(
    (t) => t.status === "valid"
  ).length;
  const invalidTemplatesCount = uploadedTemplates.filter(
    (t) => t.status === "invalid"
  ).length;

  return (
    <>
      <Head>
        <title>Upload Templates | Medical Center Management System</title>
        <meta
          name="description"
          content="Upload and manage medical report templates"
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin/report-templates/library"
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <FaArrowLeft className="mr-2" />
                  Back to Library
                </Link>
                <div className="h-6 w-px bg-gray-300"></div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Upload Templates
                </h1>
              </div>
              <button
                onClick={downloadSampleTemplate}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <FaDownload className="mr-2" />
                Download Sample
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">
              How to Upload Templates
            </h2>
            <div className="text-blue-800 space-y-2">
              <p>
                1. <strong>Prepare your templates:</strong> Templates should be
                in JSON format with proper structure
              </p>
              <p>
                2. <strong>Drag and drop:</strong> Drop your JSON files into the
                upload area below
              </p>
              <p>
                3. <strong>Review:</strong> Check that all templates pass
                validation
              </p>
              <p>
                4. <strong>Upload:</strong> Click "Upload All Valid Templates"
                to add them to your library
              </p>
            </div>
            <div className="mt-4 text-sm text-blue-700">
              <strong>Need help?</strong> Download a sample template to see the
              expected format.
            </div>
          </div>

          {/* Upload Area */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragActive
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input {...getInputProps()} />
              <FaUpload className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className="text-lg text-gray-600 mb-2">
                {isDragActive
                  ? "Drop the template files here..."
                  : "Drag & drop template files here, or click to select"}
              </p>
              <p className="text-sm text-gray-500">
                Supports JSON files (.json)
              </p>
            </div>
          </div>

          {/* Processing Progress */}
          {isProcessing && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-center mb-4">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-gray-700">Processing templates...</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Templates List */}
          {uploadedTemplates.length > 0 && (
            <div className="bg-white rounded-lg shadow-md mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Uploaded Templates ({uploadedTemplates.length})
                  </h3>
                  <div className="flex space-x-4 text-sm">
                    <span className="text-green-600">
                      ✓ {validTemplatesCount} Valid
                    </span>
                    <span className="text-red-600">
                      ✗ {invalidTemplatesCount} Invalid
                    </span>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {uploadedTemplates.map((template) => (
                  <div key={template.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="mt-1">
                          {template.status === "pending" && (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                          )}
                          {template.status === "valid" && (
                            <FaCheckCircle className="text-green-500 text-lg" />
                          )}
                          {template.status === "invalid" && (
                            <FaExclamationTriangle className="text-red-500 text-lg" />
                          )}
                          {template.status === "uploaded" && (
                            <FaCheckCircle className="text-blue-500 text-lg" />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <input
                              type="text"
                              value={template.name}
                              onChange={(e) =>
                                updateTemplate(template.id, {
                                  name: e.target.value,
                                })
                              }
                              className="font-medium text-gray-900 border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                              placeholder="Template name"
                            />
                            <select
                              value={template.category}
                              onChange={(e) =>
                                updateTemplate(template.id, {
                                  category: e.target.value,
                                })
                              }
                              className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="BLOOD_TEST">Blood Test</option>
                              <option value="URINE_TEST">Urine Test</option>
                              <option value="X_RAY">X-Ray</option>
                              <option value="ECG">ECG</option>
                              <option value="ULTRASOUND">Ultrasound</option>
                              <option value="GENERAL_REPORT">
                                General Report
                              </option>
                            </select>
                          </div>

                          <textarea
                            value={template.description}
                            onChange={(e) =>
                              updateTemplate(template.id, {
                                description: e.target.value,
                              })
                            }
                            placeholder="Template description"
                            className="w-full text-sm text-gray-600 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={2}
                          />

                          {/* Errors */}
                          {template.errors && template.errors.length > 0 && (
                            <div className="mt-3 bg-red-50 border border-red-200 rounded p-3">
                              <h4 className="text-sm font-medium text-red-800 mb-2">
                                Validation Errors:
                              </h4>
                              <ul className="text-sm text-red-700 space-y-1">
                                {template.errors.map((error, index) => (
                                  <li key={index}>• {error}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Preview */}
                          {template.previewData && (
                            <div className="mt-3 bg-gray-50 border border-gray-200 rounded p-3">
                              <h4 className="text-sm font-medium text-gray-800 mb-2">
                                Template Preview:
                              </h4>
                              <div className="text-sm text-gray-600 space-y-1">
                                <p>
                                  <strong>Category:</strong>{" "}
                                  {template.previewData.category}
                                </p>
                                <p>
                                  <strong>Static Elements:</strong>{" "}
                                  {template.previewData.staticElementsCount}
                                </p>
                                <p>
                                  <strong>Dynamic Fields:</strong>{" "}
                                  {template.previewData.dynamicFieldsCount}
                                </p>
                                {template.previewData.fields.length > 0 && (
                                  <div>
                                    <strong>Fields:</strong>
                                    <ul className="ml-4 mt-1">
                                      {template.previewData.fields
                                        .slice(0, 3)
                                        .map((field: any, index: number) => (
                                          <li key={index}>
                                            {field.label} ({field.type}) →{" "}
                                            {field.mapping}
                                          </li>
                                        ))}
                                      {template.previewData.fields.length >
                                        3 && (
                                        <li>
                                          ...and{" "}
                                          {template.previewData.fields.length -
                                            3}{" "}
                                          more
                                        </li>
                                      )}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="ml-4 flex space-x-2">
                        <button
                          onClick={() => removeTemplate(template.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Remove template"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upload Actions */}
              {validTemplatesCount > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      {validTemplatesCount} template
                      {validTemplatesCount !== 1 ? "s" : ""} ready to upload
                    </p>
                    <button
                      onClick={handleBulkUpload}
                      disabled={isProcessing}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      <FaUpload className="mr-2" />
                      {isProcessing
                        ? "Uploading..."
                        : `Upload ${validTemplatesCount} Template${
                            validTemplatesCount !== 1 ? "s" : ""
                          }`}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Template Format Guide */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Template Format Guide
            </h3>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">
                  Required Fields:
                </h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>
                    <code>templateName</code> - Name of the template
                  </li>
                  <li>
                    <code>category</code> - Template category (BLOOD_TEST,
                    X_RAY, etc.)
                  </li>
                  <li>
                    <code>staticContent</code> or <code>dynamicFields</code> -
                    Template content
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">
                  Dynamic Fields:
                </h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>
                    <code>fieldName</code> - Unique identifier for the field
                  </li>
                  <li>
                    <code>fieldType</code> - Field type (text, number, date,
                    etc.)
                  </li>
                  <li>
                    <code>dataMapping</code> - Maps to backend data (e.g.,
                    "patient.name")
                  </li>
                </ul>
              </div>
              <div>
                <p>
                  <strong>Tip:</strong> Download the sample template to see the
                  complete structure and format your templates accordingly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TemplateUploadPage;
