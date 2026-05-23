import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { useMutation, useQueryClient, useQuery } from "react-query";
import Head from "next/head";
import Link from "next/link";
import { reportTemplateAPI } from "../../../utils/api";
import TemplateDesigner from "../../../components/reports/TemplateDesigner";
import { FaArrowLeft } from "react-icons/fa";

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

        {/* Template Designer Component */}
        <TemplateDesigner
          templateId={templateId ? Number(templateId) : undefined}
          onSave={handleSave}
          onPreview={handlePreview}
        />

      </div>
    </>
  );
}
