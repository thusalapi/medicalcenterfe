import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { reportTemplateAPI } from "../../../utils/api";
import { ReportTemplate } from "../../../types";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaFilter,
  FaTimes,
  FaFileAlt,
  FaCopy,
  FaDownload,
  FaCalendarAlt,
  FaUser,
  FaLayerGroup,
} from "react-icons/fa";

export default function ViewTemplatesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(
    null
  );

  // Fetch all templates
  const {
    data: templates,
    isLoading: isTemplatesLoading,
    error,
  } = useQuery(
    ["templates", selectedCategory],
    () =>
      selectedCategory
        ? reportTemplateAPI.getTemplatesByCategory(selectedCategory)
        : reportTemplateAPI.getAllTemplates(),
    {
      onError: (error) => {
        console.error("Failed to load templates:", error);
      },
    }
  );

  // Fetch categories
  const { data: categories } = useQuery("templateCategories", () =>
    reportTemplateAPI.getCategories()
  );

  // Delete mutation
  const deleteTemplate = useMutation(
    (templateId: number) => reportTemplateAPI.deleteTemplate(templateId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("templates");
        setShowDeleteConfirm(null);
      },
      onError: (error) => {
        console.error("Failed to delete template:", error);
      },
    }
  );

  // Filter templates based on search term
  const filteredTemplates = templates?.filter(
    (template: ReportTemplate) =>
      template.templateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteTemplate = (templateId: number) => {
    deleteTemplate.mutate(templateId);
  };

  const handleDuplicateTemplate = (template: ReportTemplate) => {
    // Navigate to create new template with pre-filled data
    router.push({
      pathname: "/admin/report-templates/designer",
      query: { duplicate: template.templateId },
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      BLOOD_TEST: "bg-red-100 text-red-800",
      URINE_TEST: "bg-yellow-100 text-yellow-800",
      X_RAY: "bg-blue-100 text-blue-800",
      ECG: "bg-green-100 text-green-800",
      ULTRASOUND: "bg-purple-100 text-purple-800",
      GENERAL_REPORT: "bg-gray-100 text-gray-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  if (isTemplatesLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Error Loading Templates
          </h3>
          <p className="text-red-600">
            Failed to load report templates. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Report Templates - Medical Center</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Report Templates
            </h1>
            <p className="text-gray-600">
              Manage and organize your medical report templates
            </p>
          </div>
          <Link
            href="/admin/report-templates/designer"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="mr-2" />
            New Template
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates by name, description, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div className="md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories?.map((category: string) => (
                  <option key={category} value={category}>
                    {category.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 text-sm text-gray-600">
            {filteredTemplates?.length || 0} template(s) found
            {searchTerm && (
              <span className="ml-2">
                for "<strong>{searchTerm}</strong>"
              </span>
            )}
            {selectedCategory && (
              <span className="ml-2">
                in <strong>{selectedCategory.replace("_", " ")}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates?.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FaFileAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Templates Found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCategory
                ? "No templates match your search criteria."
                : "You haven't created any report templates yet."}
            </p>
            <Link
              href="/admin/report-templates/designer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FaPlus className="mr-2" />
              Create Your First Template
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates?.map((template: ReportTemplate) => (
              <div
                key={template.templateId}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
              >
                {/* Template Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 truncate flex-1 mr-2">
                      {template.templateName}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                        template.category
                      )}`}
                    >
                      {template.category.replace("_", " ")}
                    </span>
                  </div>

                  {template.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {template.description}
                    </p>
                  )}
                </div>

                {/* Template Stats */}
                <div className="p-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <FaLayerGroup className="mr-2 text-blue-500" />
                      <span>
                        {template.dynamicFields?.fields?.length || 0} Fields
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaCalendarAlt className="mr-2 text-green-500" />
                      <span>{formatDate(template.createdDate)}</span>
                    </div>
                  </div>

                  {template.lastModifiedDate &&
                    template.lastModifiedDate !== template.createdDate && (
                      <div className="mt-2 text-xs text-gray-500">
                        Modified: {formatDate(template.lastModifiedDate)}
                      </div>
                    )}
                </div>

                {/* Template Actions */}
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      {/* Preview */}
                      <Link
                        href={`/admin/report-templates/preview/${template.templateId}`}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Preview Template"
                      >
                        <FaEye />
                      </Link>

                      {/* Edit */}
                      <Link
                        href={`/admin/report-templates/designer?templateId=${template.templateId}`}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                        title="Edit Template"
                      >
                        <FaEdit />
                      </Link>

                      {/* Duplicate */}
                      <button
                        onClick={() => handleDuplicateTemplate(template)}
                        className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                        title="Duplicate Template"
                      >
                        <FaCopy />
                      </button>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => setShowDeleteConfirm(template.templateId)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete Template"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  {/* Use Template Button */}
                  <Link
                    href={`/reports/template-based?templateId=${template.templateId}`}
                    className="w-full mt-3 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <FaFileAlt className="mr-2" />
                    Use Template
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Delete Template
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this template? This action
                cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  disabled={deleteTemplate.isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteTemplate(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                  disabled={deleteTemplate.isLoading}
                >
                  {deleteTemplate.isLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/report-templates/designer"
              className="flex items-center p-3 bg-white rounded-md border border-blue-200 hover:border-blue-300 transition-colors"
            >
              <FaPlus className="text-blue-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">
                  Create New Template
                </div>
                <div className="text-sm text-gray-600">
                  Design a custom report template
                </div>
              </div>
            </Link>

            <Link
              href="/admin/report-templates/import-lab"
              className="flex items-center p-3 bg-white rounded-md border border-blue-200 hover:border-blue-300 transition-colors"
            >
              <FaDownload className="text-blue-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">
                  Import Lab Templates
                </div>
                <div className="text-sm text-gray-600">
                  Import predefined lab report templates
                </div>
              </div>
            </Link>

            <Link
              href="/reports/template-based"
              className="flex items-center p-3 bg-white rounded-md border border-blue-200 hover:border-blue-300 transition-colors"
            >
              <FaFileAlt className="text-blue-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">Generate Report</div>
                <div className="text-sm text-gray-600">
                  Create a report from templates
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
