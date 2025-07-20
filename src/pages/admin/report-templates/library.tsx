import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Link from "next/link";
import Head from "next/head";
import { reportTemplateAPI } from "../../../utils/api";
import {
  FaDownload,
  FaEye,
  FaPlus,
  FaSearch,
  FaFilter,
  FaHeart,
  FaStar,
  FaArrowLeft,
  FaFileUpload,
  FaCloudDownloadAlt,
} from "react-icons/fa";

interface PredefinedTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  thumbnail?: string;
  rating: number;
  downloads: number;
  createdBy: string;
  previewData: any;
  templateData: any;
  isFavorite?: boolean;
  isOfficial?: boolean;
}

// Function to generate HTML content from preview data
const generateStaticContentFromPreview = (previewData: any): string => {
  if (!previewData) {
    return "<div>Template Content</div>";
  }

  let content = "";

  // Add static elements as positioned HTML
  if (previewData.staticElements) {
    previewData.staticElements.forEach((element: any, index: number) => {
      const style = element.style || {};
      const x = 50 + index * 30; // Default positioning
      const y = 50 + index * 40;

      content += `<div style="position: absolute; left: ${x}px; top: ${y}px; font-size: ${
        style.fontSize || 14
      }px; font-weight: ${style.fontWeight || "normal"}; text-align: ${
        style.textAlign || "left"
      }; color: ${style.color || "#000"};">${
        element.content || element.label || ""
      }</div>\n`;
    });
  }

  // Add dynamic field placeholders
  if (previewData.dynamicFields) {
    previewData.dynamicFields.forEach((field: any, index: number) => {
      const x = 50 + index * 30;
      const y = 200 + index * 40; // Position below static elements
      const fieldName =
        field.fieldName ||
        field.label?.toLowerCase().replace(/\s+/g, "_") ||
        `field_${index}`;

      content += `<div style="position: absolute; left: ${x}px; top: ${y}px; width: 200px;">{{${fieldName}}}</div>\n`;
    });
  }

  return content || "<div>Template Content</div>";
};

// Function to transform dynamic fields to include required properties
const transformDynamicFields = (dynamicFields: any[]): any[] => {
  if (!dynamicFields || !Array.isArray(dynamicFields)) {
    return [];
  }

  return dynamicFields.map((field: any, index: number) => ({
    id: field.id || `field_${index}`,
    fieldName:
      field.fieldName ||
      field.label?.toLowerCase().replace(/\s+/g, "_") ||
      `field_${index}`,
    label: field.label || "Field",
    fieldType: field.fieldType || "text",
    dataMapping: field.dataMapping || "",
    required: field.required || false,
    validation: field.validation || {},
    position: field.position || { x: 50 + index * 30, y: 200 + index * 40 },
    size: field.size || { width: 200, height: 30 },
    style: field.style || {},
  }));
};

// Function to transform static elements to include required properties
const transformStaticElements = (staticElements: any[]): any[] => {
  if (!staticElements || !Array.isArray(staticElements)) {
    return [];
  }

  return staticElements.map((element: any, index: number) => ({
    id: element.id || `static_${index}`,
    content: element.content || element.label || "Static Content",
    position: element.position || { x: 50 + index * 30, y: 50 + index * 40 },
    size: element.size || { width: 200, height: 30 },
    style: element.style || {},
  }));
};

// Mock data for predefined templates - in real app, this would come from API
const predefinedTemplates: PredefinedTemplate[] = [
  {
    id: "blood-test-basic",
    name: "Basic Blood Test Report",
    description:
      "Standard blood test report template with common parameters like CBC, glucose, cholesterol",
    category: "BLOOD_TEST",
    tags: ["blood", "CBC", "glucose", "cholesterol", "basic"],
    rating: 4.8,
    downloads: 1250,
    createdBy: "Medical Center Team",
    isOfficial: true,
    previewData: {
      staticElements: [
        {
          content: "BLOOD TEST REPORT",
          style: { fontSize: 24, fontWeight: "bold" },
        },
        {
          content: "Patient Information",
          style: { fontSize: 16, fontWeight: "bold" },
        },
      ],
      dynamicFields: [
        {
          label: "Patient Name",
          fieldType: "text",
          dataMapping: "patient.name",
        },
        { label: "Test Date", fieldType: "date", dataMapping: "report.date" },
        {
          label: "Hemoglobin",
          fieldType: "number",
          dataMapping: "lab.hemoglobin",
        },
      ],
    },
    templateData: {
      templateName: "Basic Blood Test Report",
      category: "BLOOD_TEST",
      description: "Standard blood test report template",
    },
  },
  {
    id: "xray-chest",
    name: "Chest X-Ray Report",
    description:
      "Professional chest X-ray report template with radiologist findings and recommendations",
    category: "X_RAY",
    tags: ["x-ray", "chest", "radiology", "lungs"],
    rating: 4.6,
    downloads: 890,
    createdBy: "Dr. Smith Radiology",
    isOfficial: false,
    previewData: {
      staticElements: [
        {
          content: "CHEST X-RAY REPORT",
          style: { fontSize: 24, fontWeight: "bold" },
        },
        {
          content: "Radiological Findings",
          style: { fontSize: 16, fontWeight: "bold" },
        },
      ],
      dynamicFields: [
        {
          label: "Patient Name",
          fieldType: "text",
          dataMapping: "patient.name",
        },
        { label: "Study Date", fieldType: "date", dataMapping: "report.date" },
        {
          label: "Findings",
          fieldType: "textarea",
          dataMapping: "radiology.findings",
        },
      ],
    },
    templateData: {
      templateName: "Chest X-Ray Report",
      category: "X_RAY",
      description: "Professional chest X-ray report template",
    },
  },
  {
    id: "ecg-standard",
    name: "Standard ECG Report",
    description:
      "Comprehensive ECG report template with rhythm analysis and cardiac assessment",
    category: "ECG",
    tags: ["ECG", "cardiology", "heart", "rhythm"],
    rating: 4.9,
    downloads: 756,
    createdBy: "Cardiology Department",
    isOfficial: true,
    previewData: {
      staticElements: [
        {
          content: "ELECTROCARDIOGRAM REPORT",
          style: { fontSize: 24, fontWeight: "bold" },
        },
        {
          content: "Cardiac Analysis",
          style: { fontSize: 16, fontWeight: "bold" },
        },
      ],
      dynamicFields: [
        {
          label: "Patient Name",
          fieldType: "text",
          dataMapping: "patient.name",
        },
        {
          label: "Heart Rate",
          fieldType: "number",
          dataMapping: "ecg.heartRate",
        },
        { label: "Rhythm", fieldType: "text", dataMapping: "ecg.rhythm" },
      ],
    },
    templateData: {
      templateName: "Standard ECG Report",
      category: "ECG",
      description: "Comprehensive ECG report template",
    },
  },
  {
    id: "urine-analysis",
    name: "Complete Urine Analysis",
    description:
      "Detailed urine analysis report including physical, chemical, and microscopic examination",
    category: "URINE_TEST",
    tags: ["urine", "urinalysis", "microscopic", "chemical"],
    rating: 4.7,
    downloads: 623,
    createdBy: "Lab Tech Solutions",
    isOfficial: false,
    previewData: {
      staticElements: [
        {
          content: "URINE ANALYSIS REPORT",
          style: { fontSize: 24, fontWeight: "bold" },
        },
        {
          content: "Laboratory Results",
          style: { fontSize: 16, fontWeight: "bold" },
        },
      ],
      dynamicFields: [
        {
          label: "Patient Name",
          fieldType: "text",
          dataMapping: "patient.name",
        },
        { label: "Color", fieldType: "text", dataMapping: "urine.color" },
        {
          label: "Specific Gravity",
          fieldType: "number",
          dataMapping: "urine.specificGravity",
        },
      ],
    },
    templateData: {
      templateName: "Complete Urine Analysis",
      category: "URINE_TEST",
      description: "Detailed urine analysis report",
    },
  },
  {
    id: "general-medical",
    name: "General Medical Report",
    description:
      "Versatile medical report template suitable for general consultations and follow-ups",
    category: "GENERAL_REPORT",
    tags: ["general", "consultation", "medical", "versatile"],
    rating: 4.5,
    downloads: 1100,
    createdBy: "Medical Center Team",
    isOfficial: true,
    previewData: {
      staticElements: [
        {
          content: "MEDICAL REPORT",
          style: { fontSize: 24, fontWeight: "bold" },
        },
        {
          content: "Patient Assessment",
          style: { fontSize: 16, fontWeight: "bold" },
        },
      ],
      dynamicFields: [
        {
          label: "Patient Name",
          fieldType: "text",
          dataMapping: "patient.name",
        },
        {
          label: "Chief Complaint",
          fieldType: "textarea",
          dataMapping: "visit.symptoms",
        },
        {
          label: "Diagnosis",
          fieldType: "textarea",
          dataMapping: "visit.diagnosis",
        },
      ],
    },
    templateData: {
      templateName: "General Medical Report",
      category: "GENERAL_REPORT",
      description: "Versatile medical report template",
    },
  },
  {
    id: "ultrasound-abdominal",
    name: "Abdominal Ultrasound Report",
    description:
      "Comprehensive abdominal ultrasound report with organ-specific findings",
    category: "ULTRASOUND",
    tags: ["ultrasound", "abdominal", "sonography", "imaging"],
    rating: 4.4,
    downloads: 445,
    createdBy: "Imaging Center",
    isOfficial: false,
    previewData: {
      staticElements: [
        {
          content: "ABDOMINAL ULTRASOUND REPORT",
          style: { fontSize: 24, fontWeight: "bold" },
        },
        {
          content: "Sonographic Findings",
          style: { fontSize: 16, fontWeight: "bold" },
        },
      ],
      dynamicFields: [
        {
          label: "Patient Name",
          fieldType: "text",
          dataMapping: "patient.name",
        },
        {
          label: "Liver Findings",
          fieldType: "textarea",
          dataMapping: "ultrasound.liver",
        },
        {
          label: "Gallbladder",
          fieldType: "textarea",
          dataMapping: "ultrasound.gallbladder",
        },
      ],
    },
    templateData: {
      templateName: "Abdominal Ultrasound Report",
      category: "ULTRASOUND",
      description: "Comprehensive abdominal ultrasound report",
    },
  },
];

const categories = [
  { value: "", label: "All Categories" },
  { value: "BLOOD_TEST", label: "Blood Tests" },
  { value: "URINE_TEST", label: "Urine Tests" },
  { value: "X_RAY", label: "X-Ray Reports" },
  { value: "ECG", label: "ECG Reports" },
  { value: "ULTRASOUND", label: "Ultrasound Reports" },
  { value: "GENERAL_REPORT", label: "General Reports" },
];

const TemplateLibraryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("popular"); // popular, rating, newest
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] =
    useState<PredefinedTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const queryClient = useQueryClient();

  // Filter and sort templates
  const filteredTemplates = predefinedTemplates
    .filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesCategory =
        !selectedCategory || template.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return a.name.localeCompare(b.name); // Placeholder sorting
        case "popular":
        default:
          return b.downloads - a.downloads;
      }
    });

  // Use template mutation
  const useTemplate = useMutation(
    (template: PredefinedTemplate) => {
      try {
        // Transform the data using helper functions
        const transformedStaticElements = transformStaticElements(
          template.previewData?.staticElements
        );
        const transformedDynamicFields = transformDynamicFields(
          template.previewData?.dynamicFields
        );

        // Generate mappings for dynamic fields
        const mappings = transformedDynamicFields.reduce(
          (acc: any, field: any) => {
            if (field.dataMapping) {
              acc[field.fieldName] = field.dataMapping;
            }
            return acc;
          },
          {}
        );

        // Convert predefined template to the structure expected by backend
        const templateData = {
          templateName: `${template.name} (Copy)`,
          description: template.description || "",
          category: template.category,
          staticContent: generateStaticContentFromPreview(template.previewData),
          dynamicFields: {
            fields: transformedDynamicFields,
            mappings: mappings,
          },
          layoutConfig: {
            canvasSize: { width: 800, height: 600 },
            elements: [
              ...transformedStaticElements,
              ...transformedDynamicFields,
            ],
          },
        };

        console.log("Creating template with data:", templateData);
        return reportTemplateAPI.createTemplate(templateData);
      } catch (error) {
        console.error("Error transforming template data:", error);
        throw error;
      }
    },
    {
      onSuccess: (data, template) => {
        queryClient.invalidateQueries("templates");
        // Navigate to designer with the new template
        window.location.href = `/admin/report-templates/designer?templateId=${data.templateId}`;
      },
      onError: (error: any) => {
        console.error("Error using template:", error);
        // Show user-friendly error message
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Unknown error occurred";
        alert(`Failed to create template: ${errorMessage}`);
      },
    }
  );

  const toggleFavorite = (templateId: string) => {
    setFavorites((prev) =>
      prev.includes(templateId)
        ? prev.filter((id) => id !== templateId)
        : [...prev, templateId]
    );
  };

  const handlePreview = (template: PredefinedTemplate) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const handleUseTemplate = (template: PredefinedTemplate) => {
    useTemplate.mutate(template);
  };

  return (
    <>
      <Head>
        <title>Template Library | Medical Center Management System</title>
        <meta
          name="description"
          content="Browse and use predefined medical report templates"
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin/report-templates"
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <FaArrowLeft className="mr-2" />
                  Back to Templates
                </Link>
                <div className="h-6 w-px bg-gray-300"></div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Template Library
                </h1>
              </div>
              <div className="flex items-center space-x-3">
                <Link
                  href="/admin/report-templates/library/upload"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <FaFileUpload className="mr-2" />
                  Upload Templates
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-100 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Predefined Medical Report Templates
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                Choose from our collection of professionally designed medical
                report templates. These templates are ready to use and can be
                customized to fit your medical center's needs.
              </p>
              <div className="flex justify-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <FaStar className="text-yellow-500 mr-1" />
                  <span>Quality Rated</span>
                </div>
                <div className="flex items-center">
                  <FaCloudDownloadAlt className="text-blue-500 mr-1" />
                  <span>Ready to Use</span>
                </div>
                <div className="flex items-center">
                  <FaPlus className="text-green-500 mr-1" />
                  <span>Customizable</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search templates by name, description, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="lg:w-48">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="lg:w-48">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredTemplates.length} template
              {filteredTemplates.length !== 1 ? "s" : ""}
              {selectedCategory &&
                ` in ${
                  categories.find((c) => c.value === selectedCategory)?.label
                }`}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>

          {/* Template Grid */}
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No templates found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or browse all categories.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden"
                >
                  {/* Template Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
                        {template.name}
                      </h3>
                      <button
                        onClick={() => toggleFavorite(template.id)}
                        className={`ml-2 p-1 rounded ${
                          favorites.includes(template.id)
                            ? "text-red-500 hover:text-red-600"
                            : "text-gray-400 hover:text-red-500"
                        }`}
                      >
                        <FaHeart />
                      </button>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {template.description}
                    </p>

                    {/* Template Meta */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <FaStar className="text-yellow-400 mr-1" />
                          <span>{template.rating}</span>
                        </div>
                        <div className="flex items-center">
                          <FaDownload className="mr-1" />
                          <span>{template.downloads}</span>
                        </div>
                      </div>
                      {template.isOfficial && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                          Official
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {template.tags.length > 3 && (
                        <span className="text-gray-500 text-xs">
                          +{template.tags.length - 3} more
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-500">
                      by {template.createdBy}
                    </p>
                  </div>

                  {/* Template Actions */}
                  <div className="p-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePreview(template)}
                        className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <FaEye className="mr-1" />
                        Preview
                      </button>
                      <button
                        onClick={() => handleUseTemplate(template)}
                        disabled={useTemplate.isLoading}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        <FaPlus className="mr-1" />
                        {useTemplate.isLoading ? "Using..." : "Use Template"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preview Modal */}
        {showPreview && selectedTemplate && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                onClick={() => setShowPreview(false)}
              ></div>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                <div className="bg-white px-6 pt-5 pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Preview: {selectedTemplate.name}
                    </h3>
                    <button
                      onClick={() => setShowPreview(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg mb-4">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Template Preview
                    </h4>
                    <div className="bg-white p-4 rounded border space-y-4">
                      {/* Static Elements Preview */}
                      {selectedTemplate.previewData.staticElements.map(
                        (element: any, index: number) => (
                          <div
                            key={index}
                            style={{
                              fontSize: element.style.fontSize,
                              fontWeight: element.style.fontWeight,
                            }}
                            className="text-gray-900"
                          >
                            {element.content}
                          </div>
                        )
                      )}

                      {/* Dynamic Fields Preview */}
                      <div className="space-y-2">
                        {selectedTemplate.previewData.dynamicFields.map(
                          (field: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-center space-x-3"
                            >
                              <span className="text-sm font-medium text-gray-700 w-32">
                                {field.label}:
                              </span>
                              <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                {`{{${field.dataMapping}}}`}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowPreview(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        setShowPreview(false);
                        handleUseTemplate(selectedTemplate);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Use This Template
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TemplateLibraryPage;
