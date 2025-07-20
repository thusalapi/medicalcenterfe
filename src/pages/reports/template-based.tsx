import React, { useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { reportTemplateAPI } from "../../utils/api";
import ReportGenerator from "../../components/reports/ReportGenerator";
import {
  FaFileAlt,
  FaPlus,
  FaSearch,
  FaFilter,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";

const TemplateBasedReportPage: React.FC = () => {
  const router = useRouter();
  const { patientId, visitId } = router.query;

  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Fetch templates
  const { data: templates, isLoading: isTemplatesLoading } = useQuery(
    ["templates", selectedCategory],
    () =>
      selectedCategory
        ? reportTemplateAPI.getTemplatesByCategory(selectedCategory)
        : reportTemplateAPI.getAllTemplates(),
    {
      onError: () => {
        console.error("Failed to load templates");
      },
    }
  );

  // Fetch categories
  const { data: categories } = useQuery("templateCategories", () =>
    reportTemplateAPI.getCategories()
  );

  // Filter templates based on search term
  const filteredTemplates = templates?.filter(
    (template: any) =>
      template.templateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTemplateSelect = (templateId: number) => {
    setSelectedTemplateId(templateId);
  };

  const handleBackToSelection = () => {
    setSelectedTemplateId(null);
  };

  const handleReportGenerated = (reportId: number) => {
    // Navigate to the generated report or show success message
    console.log("Report generated with ID:", reportId);
  };

  if (selectedTemplateId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={handleBackToSelection}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <FaTimes className="mr-2" />
            Back to Template Selection
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Generate Report</h1>
        </div>

        <ReportGenerator
          templateId={selectedTemplateId}
          patientId={patientId ? parseInt(patientId as string) : undefined}
          visitId={visitId ? parseInt(visitId as string) : undefined}
          onGenerated={handleReportGenerated}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Select Report Template
        </h1>
        <p className="text-gray-600">
          Choose a template to generate a medical report
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories?.map((category: string) => (
                <option key={category} value={category}>
                  {category.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          {/* Create New Template Button */}
          <div className="flex justify-end">
            <button
              onClick={() => router.push("/admin/report-templates/designer")}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FaPlus className="mr-2" />
              Create New Template
            </button>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isTemplatesLoading ? (
          <div className="col-span-full flex items-center justify-center py-8">
            <FaSpinner className="animate-spin text-blue-600 text-2xl mr-2" />
            <span className="text-gray-600">Loading templates...</span>
          </div>
        ) : filteredTemplates?.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <FaFileAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No templates found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedCategory
                ? "Try adjusting your search or filter criteria"
                : "Create your first report template to get started"}
            </p>
            <button
              onClick={() => router.push("/admin/report-templates/designer")}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FaPlus className="mr-2" />
              Create Template
            </button>
          </div>
        ) : (
          filteredTemplates?.map((template: any) => (
            <div
              key={template.templateId}
              className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleTemplateSelect(template.templateId)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FaFileAlt className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {template.templateName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {template.category?.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {template.description || "No description available"}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Created:{" "}
                    {new Date(template.createdDate).toLocaleDateString()}
                  </span>
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                    Use Template →
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Blood Test Template Example */}
      {filteredTemplates?.length === 0 && !searchTerm && !selectedCategory && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Example: Blood Test Report Template
          </h3>
          <p className="text-blue-800 mb-4">
            Here's how you would create a blood test report template:
          </p>
          <div className="bg-white rounded-md p-4 border border-blue-200">
            <div className="text-sm space-y-2">
              <div>
                <strong>1. Static Content:</strong> Add permanent text like
                "Blood Test Report", hospital header, etc.
              </div>
              <div>
                <strong>2. Dynamic Fields:</strong> Drag and drop fields for
                patient data, test results
              </div>
              <div>
                <strong>3. Generate Reports:</strong> Fill in the fields and
                generate PDF reports
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateBasedReportPage;
