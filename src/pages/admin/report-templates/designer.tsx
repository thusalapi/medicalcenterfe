import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { useMutation, useQueryClient, useQuery } from "react-query";
import Head from "next/head";
import Link from "next/link";
import { reportTemplateAPI } from "../../../utils/api";
import TemplateDesigner from "../../../components/reports/TemplateDesigner";
import {
  FaSave,
  FaEye,
  FaPlus,
  FaArrowLeft,
  FaFileAlt,
  FaLayerGroup,
  FaUsers,
  FaHospital,
  FaClipboardList,
} from "react-icons/fa";

export default function TemplateDesignerPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { templateId } = router.query;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load existing template if editing
  const { data: existingTemplate, isLoading: isLoadingTemplate } = useQuery(
    ["template", templateId],
    () => reportTemplateAPI.getTemplateById(Number(templateId)),
    {
      enabled: !!templateId,
      onError: (error) => {
        console.error("Error loading template:", error);
        setError("Failed to load template for editing");
      },
    }
  );

  // Create/Update template mutation
  const saveTemplate = useMutation(
    (templateData: any) => {
      if (templateId) {
        return reportTemplateAPI.updateTemplate(
          Number(templateId),
          templateData
        );
      } else {
        return reportTemplateAPI.createTemplate(templateData);
      }
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("templates");
        setSuccess(
          templateId
            ? "Template updated successfully!"
            : "Template created successfully!"
        );
        setError(null);

        // Navigate to view page after a short delay
        setTimeout(() => {
          router.push("/admin/report-templates/view");
        }, 2000);
      },
      onError: (error: any) => {
        console.error("Error saving template:", error);
        setError(
          error.response?.data?.message ||
            "Failed to save template. Please try again."
        );
        setSuccess(null);
      },
      onSettled: () => {
        setIsLoading(false);
      },
    }
  );

  const handleSave = (templateData: any) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Add medical center specific validation
    if (!templateData.templateName?.trim()) {
      setError("Please enter a template name");
      setIsLoading(false);
      return;
    }

    if (!templateData.category) {
      setError("Please select a medical report category");
      setIsLoading(false);
      return;
    }

    // Validate that we have at least one element
    const hasStaticElements = templateData.staticContent?.elements?.length > 0;
    const hasDynamicFields = templateData.dynamicFields?.fields?.length > 0;

    if (!hasStaticElements && !hasDynamicFields) {
      setError(
        "Please add at least one element to your medical report template"
      );
      setIsLoading(false);
      return;
    }

    // Validate dynamic fields have data mapping for medical center usage
    const unmappedFields =
      templateData.dynamicFields?.fields?.filter(
        (field: any) => !field.dataMapping
      ) || [];

    if (unmappedFields.length > 0) {
      setError(
        `Please configure data mapping for ${unmappedFields.length} dynamic field(s). This is required for medical data integration.`
      );
      setIsLoading(false);
      return;
    }

    console.log("Saving medical report template:", templateData);
    saveTemplate.mutate(templateData);
  };

  const handlePreview = (templateData: any) => {
    // For now, just show an alert. In the future, this could open a preview modal
    alert(
      "Preview functionality will open a modal showing how the medical report will look with sample data."
    );
  };

  if (isLoadingTemplate) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading template...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>
          {templateId ? "Edit" : "Design"} Medical Report Template - Medical
          Center
        </title>
        <meta
          name="description"
          content="Design custom medical report templates with drag-and-drop interface for your medical center"
        />
      </Head>

      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Left side - Navigation */}
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin/report-templates/view"
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <FaArrowLeft className="mr-2" />
                  Back to Templates
                </Link>
                <div className="h-6 w-px bg-gray-300"></div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {templateId ? "Edit" : "Design"} Medical Report Template
                </h1>
              </div>

              {/* Right side - Status */}
              <div className="flex items-center space-x-4">
                {error && (
                  <div className="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-md text-sm">
                    {success}
                  </div>
                )}
                {isLoading && (
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm">
                    Saving...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Medical Center Guidance Banner */}
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-start space-x-3">
              <FaHospital className="text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-blue-900 mb-1">
                  Medical Report Template Designer
                </h3>
                <p className="text-sm text-blue-700 mb-2">
                  Create professional medical report templates for your
                  healthcare facility. Design layouts for lab results, patient
                  reports, medical certificates, and more.
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-blue-600">
                  <div className="flex items-center">
                    <FaLayerGroup className="mr-1" />
                    <span>Drag & Drop Elements</span>
                  </div>
                  <div className="flex items-center">
                    <FaUsers className="mr-1" />
                    <span>Patient Data Integration</span>
                  </div>
                  <div className="flex items-center">
                    <FaClipboardList className="mr-1" />
                    <span>Medical Categories</span>
                  </div>
                  <div className="flex items-center">
                    <FaFileAlt className="mr-1" />
                    <span>Professional Layout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Template Designer Component */}
        <TemplateDesigner
          templateId={templateId ? Number(templateId) : undefined}
          onSave={handleSave}
          onPreview={handlePreview}
        />

        {/* Medical Center Instructions Footer */}
        <div className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center md:text-left">
                <h4 className="font-semibold text-gray-900 mb-2">
                  📋 Static Elements
                </h4>
                <p className="text-sm text-gray-600">
                  Add permanent content like clinic headers, instructions, and
                  labels that appear on every report.
                </p>
              </div>
              <div className="text-center md:text-left">
                <h4 className="font-semibold text-gray-900 mb-2">
                  🔄 Dynamic Fields
                </h4>
                <p className="text-sm text-gray-600">
                  Insert patient data fields that automatically populate with
                  information from your medical records.
                </p>
              </div>
              <div className="text-center md:text-left">
                <h4 className="font-semibold text-gray-900 mb-2">
                  ⚕️ Medical Integration
                </h4>
                <p className="text-sm text-gray-600">
                  Connect fields to patient records, visit data, lab results,
                  and other medical information systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
