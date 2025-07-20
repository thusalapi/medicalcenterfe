import React, { useState, useEffect, useRef } from "react";
import {
  FaPlus,
  FaMinus,
  FaEdit,
  FaTrash,
  FaGripVertical,
  FaSave,
  FaEye,
  FaPrint,
  FaFileAlt,
  FaDatabase,
  FaTextHeight,
  FaAlignLeft,
  FaCalendarAlt,
  FaListOl,
} from "react-icons/fa";

interface DynamicField {
  id: string;
  fieldName: string;
  fieldType: "text" | "number" | "date" | "textarea" | "select" | "checkbox";
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  position: { x: number; y: number };
  size: { width: number; height: number };
  dataMapping?: string; // Maps to backend data fields like "patient.name", "visit.date"
  isDynamic: true;
}

interface StaticElement {
  id: string;
  type: "text" | "image" | "line" | "table";
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: {
    fontSize?: number;
    fontWeight?: "normal" | "bold";
    textAlign?: "left" | "center" | "right";
    color?: string;
  };
  isDynamic: false;
  isEditing?: boolean; // Track if element is being edited
}

interface TemplateDesignerProps {
  templateId?: number;
  onSave: (templateData: any) => void;
  onPreview: (templateData: any) => void;
}

const TemplateDesigner: React.FC<TemplateDesignerProps> = ({
  templateId,
  onSave,
  onPreview,
}) => {
  const [templateName, setTemplateName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("BLOOD_TEST");
  const [staticElements, setStaticElements] = useState<StaticElement[]>([]);
  const [dynamicFields, setDynamicFields] = useState<DynamicField[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showFieldPanel, setShowFieldPanel] = useState(false);
  const [draggedField, setDraggedField] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState<{
    message: string;
    type: "info" | "success" | "warning" | "error";
  } | null>(null);
  const [showTemplateOptions, setShowTemplateOptions] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Available field types for dragging
  const availableFields = [
    { type: "text", label: "Text Field", icon: FaTextHeight },
    { type: "number", label: "Number Field", icon: FaListOl },
    { type: "date", label: "Date Field", icon: FaCalendarAlt },
    { type: "textarea", label: "Text Area", icon: FaAlignLeft },
    { type: "select", label: "Dropdown", icon: FaDatabase },
  ];

  // Available data mappings for dynamic fields
  const dataMappings = [
    { value: "patient.name", label: "Patient Name" },
    { value: "patient.age", label: "Patient Age" },
    { value: "patient.gender", label: "Patient Gender" },
    { value: "patient.address", label: "Patient Address" },
    { value: "patient.phone", label: "Patient Phone" },
    { value: "patient.email", label: "Patient Email" },
    { value: "visit.date", label: "Visit Date" },
    { value: "visit.symptoms", label: "Visit Symptoms" },
    { value: "visit.diagnosis", label: "Visit Diagnosis" },
    { value: "visit.prescription", label: "Visit Prescription" },
    { value: "visit.doctor", label: "Doctor Name" },
    { value: "report.date", label: "Report Date" },
    { value: "report.type", label: "Report Type" },
    { value: "custom", label: "Custom Field" },
  ];

  // Template categories
  const categories = [
    "BLOOD_TEST",
    "URINE_TEST",
    "X_RAY",
    "ECG",
    "ULTRASOUND",
    "GENERAL_REPORT",
  ];

  useEffect(() => {
    if (templateId) {
      // Load existing template data
      loadTemplate(templateId);
    } else {
      // Show template options for new templates
      setShowTemplateOptions(true);
    }
  }, [templateId]);

  const loadTemplate = async (id: number) => {
    try {
      // Fetch template data from API
      // const response = await reportTemplateAPI.getTemplateById(id);
      // setTemplateData(response.data);
    } catch (error) {
      console.error("Error loading template:", error);
    }
  };

  const initializeDefaultTemplate = () => {
    const defaultTitle: StaticElement = {
      id: "title-1",
      type: "text",
      content: "Medical Report Template",
      position: { x: 100, y: 50 },
      size: { width: 400, height: 40 },
      style: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        color: "#333333",
      },
      isDynamic: false,
    };

    const defaultHeader: StaticElement = {
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
      isDynamic: false,
    };

    setStaticElements([defaultTitle, defaultHeader]);
    setShowTemplateOptions(false);
  };

  const initializeBlankTemplate = () => {
    setStaticElements([]);
    setDynamicFields([]);
    setSelectedElement(null);
    setShowTemplateOptions(false);
    showNotificationMessage(
      "Blank template created. Start by adding static text or dynamic fields!",
      "info"
    );
  };

  const resetTemplate = () => {
    setStaticElements([]);
    setDynamicFields([]);
    setSelectedElement(null);
    setTemplateName("");
    setDescription("");
    setCategory("BLOOD_TEST");
    setShowTemplateOptions(true);
  };

  // Show notification helper
  const showNotificationMessage = (
    message: string,
    type: "info" | "success" | "warning" | "error" = "info"
  ) => {
    setShowNotification({ message, type });
    setTimeout(() => setShowNotification(null), 3000);
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();

    if (!draggedField || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newField: DynamicField = {
      id: `field-${Date.now()}`,
      fieldName: `field_${dynamicFields.length + 1}`,
      fieldType: draggedField as any,
      label: `${
        draggedField.charAt(0).toUpperCase() + draggedField.slice(1)
      } Field`,
      placeholder: `Enter ${draggedField}`,
      required: false,
      position: { x: Math.max(0, x - 50), y: Math.max(0, y - 15) },
      size: { width: 200, height: 30 },
      isDynamic: true,
      dataMapping: "", // Will be filled by user
    };

    setDynamicFields([...dynamicFields, newField]);
    setSelectedElement(newField.id);
    setDraggedField(null);

    showNotificationMessage(
      "Dynamic field added! Please configure the data mapping in the properties panel.",
      "info"
    );
  };

  const handleElementClick = (elementId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDragging) {
      setSelectedElement(elementId);
    }
  };

  const updateStaticElement = (id: string, updates: Partial<StaticElement>) => {
    setStaticElements((elements) =>
      elements.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  const updateDynamicField = (id: string, updates: Partial<DynamicField>) => {
    setDynamicFields((fields) =>
      fields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      )
    );
  };

  const deleteElement = (id: string) => {
    setStaticElements((elements) => elements.filter((el) => el.id !== id));
    setDynamicFields((fields) => fields.filter((field) => field.id !== id));
    setSelectedElement(null);
  };

  const addStaticText = () => {
    const newElement: StaticElement = {
      id: `text-${Date.now()}`,
      type: "text",
      content: "Click to edit text",
      position: { x: 100, y: 200 },
      size: { width: 200, height: 30 },
      style: {
        fontSize: 14,
        fontWeight: "normal",
        textAlign: "left",
        color: "#333333",
      },
      isDynamic: false,
      isEditing: true, // Start in editing mode
    };

    setStaticElements([...staticElements, newElement]);
    setSelectedElement(newElement.id); // Auto-select for immediate editing
    showNotificationMessage(
      "Static text element added! Click the text to edit its content.",
      "info"
    );
  };

  // Handle element dragging for repositioning
  const handleElementMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedElementId(elementId);
    setIsDragging(true);
    setSelectedElement(elementId);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !draggedElementId || !canvasRef.current) return;

    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update position for static elements
    const staticElement = staticElements.find(
      (el) => el.id === draggedElementId
    );
    if (staticElement) {
      updateStaticElement(draggedElementId, {
        position: { x: Math.max(0, x - 50), y: Math.max(0, y - 15) },
      });
    }

    // Update position for dynamic fields
    const dynamicField = dynamicFields.find(
      (field) => field.id === draggedElementId
    );
    if (dynamicField) {
      updateDynamicField(draggedElementId, {
        position: { x: Math.max(0, x - 50), y: Math.max(0, y - 15) },
      });
    }
  };

  const handleCanvasMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setDraggedElementId(null);
  };

  const handleSave = () => {
    // Validate template before saving
    const unmappedFields = dynamicFields.filter((field) => !field.dataMapping);

    if (unmappedFields.length > 0) {
      showNotificationMessage(
        `Please configure data mapping for ${unmappedFields.length} dynamic field(s) before saving.`,
        "error"
      );
      return;
    }

    if (!templateName.trim()) {
      showNotificationMessage("Please enter a template name.", "error");
      return;
    }

    if (staticElements.length === 0 && dynamicFields.length === 0) {
      showNotificationMessage(
        "Please add at least one element to the template.",
        "error"
      );
      return;
    }

    const templateData = {
      templateName,
      description,
      category,
      staticContent: {
        content: generateFullHtmlContent(), // Use full HTML for backend storage and PDF generation
        elements: staticElements,
      },
      dynamicFields: {
        fields: dynamicFields.map((field) => ({
          fieldName: field.fieldName,
          fieldType: field.fieldType,
          label: field.label,
          placeholder: field.placeholder,
          required: field.required,
          options: field.options,
          position: field.position,
          size: field.size,
          dataMapping: field.dataMapping,
          isDynamic: field.isDynamic,
        })),
        mappings: dynamicFields.reduce((acc, field) => {
          if (field.dataMapping) {
            acc[field.fieldName] = field.dataMapping;
          }
          return acc;
        }, {} as Record<string, string>),
      },
      layoutConfig: {
        canvasSize: { width: 800, height: 600 },
        elements: [...staticElements, ...dynamicFields],
      },
    };

    showNotificationMessage("Template saved successfully!", "success");
    onSave(templateData);
  };

  const generateStaticContent = () => {
    // Convert static elements and dynamic field placeholders to properly formatted HTML
    const bodyParts: string[] = [];

    // Create a container div for the template content
    bodyParts.push(
      `<div class="template-container" style="position: relative; width: 800px; height: 600px; font-family: Arial, sans-serif;">`
    );

    // Add static elements with proper HTML structure
    staticElements.forEach((element) => {
      const styles = [
        `position: absolute`,
        `left: ${element.position.x}px`,
        `top: ${element.position.y}px`,
        `width: ${element.size.width}px`,
        `height: ${element.size.height}px`,
        `font-size: ${element.style.fontSize}px`,
        `font-weight: ${element.style.fontWeight}`,
        `text-align: ${element.style.textAlign}`,
        `color: ${element.style.color}`,
        `overflow: hidden`,
        `word-wrap: break-word`,
      ].join("; ");

      // Escape HTML content to prevent injection
      const escapedContent = element.content
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;");

      bodyParts.push(`<div style="${styles}">${escapedContent}</div>`);
    });

    // Add dynamic field placeholders with proper HTML structure
    dynamicFields.forEach((field) => {
      const styles = [
        `position: absolute`,
        `left: ${field.position.x}px`,
        `top: ${field.position.y}px`,
        `width: ${field.size.width}px`,
        `height: ${field.size.height}px`,
        `padding: 4px`,
        `overflow: hidden`,
        `word-wrap: break-word`,
        `font-family: Arial, sans-serif`,
        `font-size: 14px`,
      ].join("; ");

      bodyParts.push(`<div style="${styles}">{{${field.fieldName}}}</div>`);
    });

    // Close container
    bodyParts.push(`</div>`);

    const content = bodyParts.join("\n");

    // Return basic content if no elements exist
    if (staticElements.length === 0 && dynamicFields.length === 0) {
      return `<div class="template-container" style="position: relative; width: 800px; height: 600px; border: 1px solid #ddd; font-family: Arial, sans-serif;">
<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #666;">Template Content</div>
</div>`;
    }

    return content;
  };

  // Generate full HTML document for backend storage/PDF generation
  const generateFullHtmlContent = () => {
    const bodyContent = generateStaticContent();

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${templateName || "Medical Report"}</title>
<style>
body { 
  font-family: Arial, sans-serif; 
  margin: 0; 
  padding: 20px; 
  line-height: 1.4;
}
.template-container { 
  position: relative; 
  width: 800px; 
  height: auto;
  min-height: 600px;
  margin: 0 auto;
}
@page {
  size: A4;
  margin: 2cm;
}
@media print {
  body { margin: 0; padding: 10px; }
  .template-container { width: 100%; max-width: 100%; }
}
</style>
</head>
<body>
${bodyContent}
</body>
</html>`;
  };

  const handlePreview = () => {
    const templateData = {
      templateName,
      description,
      category,
      staticContent: {
        content: generateStaticContent(),
        elements: staticElements,
      },
      dynamicFields: {
        fields: dynamicFields,
      },
    };

    onPreview(templateData);
  };

  return (
    <>
      {/* Template Options Modal */}
      {showTemplateOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Choose Template Type
              </h2>
              <p className="text-gray-600 mb-6">
                How would you like to start your template?
              </p>

              <div className="space-y-4">
                {/* Default Template Option */}
                <div
                  onClick={initializeDefaultTemplate}
                  className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaFileAlt className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 mb-1">
                        Default Template
                      </h3>
                      <p className="text-sm text-gray-600">
                        Start with pre-configured title and header elements
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Includes: "Medical Report Template" title and "Patient Information" header
                      </p>
                    </div>
                  </div>
                </div>

                {/* Blank Template Option */}
                <div
                  onClick={initializeBlankTemplate}
                  className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaPlus className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 mb-1">
                        Blank Template
                      </h3>
                      <p className="text-sm text-gray-600">
                        Start with an empty canvas and build from scratch
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Complete freedom to design your template layout
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  You can always add, remove, or modify elements later
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Template Designer */}
      <div className="template-designer h-screen flex">
      {/* Left Sidebar - Tools */}
      <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Template Designer
          </h2>
        </div>

        {/* Template Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template Name
              </label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter template name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Template description"
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Static Elements */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Static Elements
          </h3>
          <button
            onClick={addStaticText}
            className="w-full flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FaPlus className="mr-2" />
            Add Text
          </button>
        </div>

        {/* Dynamic Fields */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Dynamic Fields
          </h3>
          <div className="space-y-2 mb-4">
            {availableFields.map((field) => (
              <div
                key={field.type}
                draggable
                onDragStart={() => setDraggedField(field.type)}
                className="flex items-center p-2 bg-white border border-gray-200 rounded-md cursor-move hover:bg-gray-50 transition-colors"
              >
                <field.icon className="mr-2 text-gray-500" />
                <span className="text-sm text-gray-700">{field.label}</span>
              </div>
            ))}
          </div>

          <div className="bg-green-50 p-3 rounded-md border border-green-200">
            <h4 className="text-xs font-semibold text-green-800 mb-2">
              💡 How to use:
            </h4>
            <ul className="text-xs text-green-700 space-y-1">
              <li>• Drag fields to canvas</li>
              <li>• Click to select and configure</li>
              <li>• Set data mapping in properties</li>
              <li>• Move elements by dragging</li>
            </ul>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-4 flex-1">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Quick Guide
          </h3>
          <div className="space-y-3 text-xs text-gray-600">
            <div className="bg-blue-50 p-2 rounded border border-blue-200">
              <strong className="text-blue-800">📄 Static Elements:</strong>
              <p className="mt-1">
                Permanent content like titles, headers, labels. Double-click to
                edit.
              </p>
            </div>

            <div className="bg-green-50 p-2 rounded border border-green-200">
              <strong className="text-green-800">📊 Dynamic Fields:</strong>
              <p className="mt-1">
                Data placeholders filled during report generation. Must set data
                mapping!
              </p>
            </div>

            <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
              <strong className="text-yellow-800">⚠️ Required:</strong>
              <p className="mt-1">
                All dynamic fields need data mapping before saving.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <div className="flex space-x-2 mb-2">
            <button
              onClick={resetTemplate}
              className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
              title="Reset and choose template type"
            >
              <FaPlus className="mr-1" />
              Reset
            </button>
            <button
              onClick={initializeBlankTemplate}
              className="flex-1 flex items-center justify-center px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm"
              title="Clear all content"
            >
              Clear All
            </button>
          </div>
          
          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <FaSave className="mr-2" />
            Save Template
          </button>
          <button
            onClick={handlePreview}
            className="w-full flex items-center justify-center px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            <FaEye className="mr-2" />
            Preview
          </button>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4">
          <h1 className="text-xl font-semibold text-gray-800">
            {templateName || "New Template"}
          </h1>
        </div>

        <div className="flex-1 p-4 bg-gray-100">
          {/* Notification */}
          {showNotification && (
            <div
              className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
                showNotification.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : showNotification.type === "warning"
                  ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                  : showNotification.type === "error"
                  ? "bg-red-100 text-red-800 border border-red-200"
                  : "bg-blue-100 text-blue-800 border border-blue-200"
              }`}
            >
              {showNotification.message}
            </div>
          )}

          <div
            ref={canvasRef}
            className="relative bg-white border border-gray-300 mx-auto"
            style={{ width: "800px", height: "600px", minHeight: "600px" }}
            onDrop={handleCanvasDrop}
            onDragOver={(e) => e.preventDefault()}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
          >
            {/* Static Elements */}
            {staticElements.map((element) => (
              <div
                key={element.id}
                className={`absolute cursor-move border-2 transition-all ${
                  selectedElement === element.id
                    ? "border-blue-500 shadow-lg"
                    : "border-transparent"
                } hover:border-blue-300 hover:shadow-md`}
                style={{
                  left: element.position.x,
                  top: element.position.y,
                  width: element.size.width,
                  height: element.size.height,
                  fontSize: element.style.fontSize,
                  fontWeight: element.style.fontWeight,
                  textAlign: element.style.textAlign,
                  color: element.style.color,
                  padding: "4px",
                  backgroundColor:
                    selectedElement === element.id
                      ? "rgba(59, 130, 246, 0.1)"
                      : "transparent",
                }}
                onClick={(e) => handleElementClick(element.id, e)}
                onMouseDown={(e) => handleElementMouseDown(e, element.id)}
              >
                {element.isEditing ? (
                  <input
                    type="text"
                    value={element.content}
                    onChange={(e) =>
                      updateStaticElement(element.id, {
                        content: e.target.value,
                      })
                    }
                    onBlur={() =>
                      updateStaticElement(element.id, { isEditing: false })
                    }
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        updateStaticElement(element.id, { isEditing: false });
                      }
                    }}
                    className="w-full h-full border-none outline-none bg-transparent"
                    autoFocus
                  />
                ) : (
                  <div
                    onDoubleClick={() =>
                      updateStaticElement(element.id, { isEditing: true })
                    }
                    className="w-full h-full flex items-center"
                  >
                    {element.content}
                  </div>
                )}

                {selectedElement === element.id && (
                  <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    Static Text (Double-click to edit)
                  </div>
                )}
              </div>
            ))}

            {/* Dynamic Fields */}
            {dynamicFields.map((field) => (
              <div
                key={field.id}
                className={`absolute cursor-move border-2 transition-all ${
                  selectedElement === field.id
                    ? "border-green-500 shadow-lg"
                    : "border-dashed border-gray-400"
                } hover:border-green-400 hover:shadow-md bg-green-50 bg-opacity-50`}
                style={{
                  left: field.position.x,
                  top: field.position.y,
                  width: field.size.width,
                  height: field.size.height,
                  padding: "4px",
                  fontSize: "12px",
                  backgroundColor:
                    selectedElement === field.id
                      ? "rgba(34, 197, 94, 0.2)"
                      : "rgba(34, 197, 94, 0.1)",
                }}
                onClick={(e) => handleElementClick(field.id, e)}
                onMouseDown={(e) => handleElementMouseDown(e, field.id)}
              >
                <div className="text-green-700 font-medium truncate">
                  {field.label}
                </div>
                <div className="text-green-600 text-xs truncate">
                  {field.dataMapping
                    ? `📊 ${field.dataMapping}`
                    : "⚠️ No data mapping"}
                </div>
                <div className="text-green-500 text-xs">
                  {`{{${field.fieldName}}}`}
                </div>

                {selectedElement === field.id && (
                  <div className="absolute -top-6 left-0 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    Dynamic Field (Configure mapping →)
                  </div>
                )}

                {!field.dataMapping && (
                  <div className="absolute -top-3 -right-3 w-6 h-6 bg-yellow-500 text-white text-xs rounded-full flex items-center justify-center">
                    !
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      {selectedElement && (
        <div className="w-80 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Properties</h3>
            <button
              onClick={() => deleteElement(selectedElement)}
              className="text-red-600 hover:text-red-800"
            >
              <FaTrash />
            </button>
          </div>

          {(() => {
            const staticElement = staticElements.find(
              (el) => el.id === selectedElement
            );
            const dynamicField = dynamicFields.find(
              (field) => field.id === selectedElement
            );

            if (staticElement) {
              return (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">
                      📄 Static Text Element
                    </h4>
                    <p className="text-sm text-blue-600">
                      This is permanent content that will always appear in
                      reports.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content
                    </label>
                    <textarea
                      value={staticElement.content}
                      onChange={(e) =>
                        updateStaticElement(selectedElement, {
                          content: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Font Size
                      </label>
                      <input
                        type="number"
                        value={staticElement.style.fontSize || 14}
                        onChange={(e) =>
                          updateStaticElement(selectedElement, {
                            style: {
                              ...staticElement.style,
                              fontSize: parseInt(e.target.value),
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="8"
                        max="72"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Font Weight
                      </label>
                      <select
                        value={staticElement.style.fontWeight || "normal"}
                        onChange={(e) =>
                          updateStaticElement(selectedElement, {
                            style: {
                              ...staticElement.style,
                              fontWeight: e.target.value as any,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="normal">Normal</option>
                        <option value="bold">Bold</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Text Alignment
                    </label>
                    <select
                      value={staticElement.style.textAlign || "left"}
                      onChange={(e) =>
                        updateStaticElement(selectedElement, {
                          style: {
                            ...staticElement.style,
                            textAlign: e.target.value as any,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Text Color
                    </label>
                    <input
                      type="color"
                      value={staticElement.style.color || "#333333"}
                      onChange={(e) =>
                        updateStaticElement(selectedElement, {
                          style: {
                            ...staticElement.style,
                            color: e.target.value,
                          },
                        })
                      }
                      className="w-full h-10 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              );
            }

            if (dynamicField) {
              return (
                <div className="space-y-4">
                  <div className="bg-green-50 p-3 rounded-md border border-green-200">
                    <h4 className="font-medium text-green-800 mb-2">
                      📊 Dynamic Field
                    </h4>
                    <p className="text-sm text-green-600">
                      This field will be filled with data when generating
                      reports.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Field Label
                    </label>
                    <input
                      type="text"
                      value={dynamicField.label}
                      onChange={(e) =>
                        updateDynamicField(selectedElement, {
                          label: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Field Type
                    </label>
                    <select
                      value={dynamicField.fieldType}
                      onChange={(e) =>
                        updateDynamicField(selectedElement, {
                          fieldType: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="date">Date</option>
                      <option value="textarea">Text Area</option>
                      <option value="select">Dropdown</option>
                      <option value="checkbox">Checkbox</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data Mapping <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={dynamicField.dataMapping || ""}
                      onChange={(e) => {
                        updateDynamicField(selectedElement, {
                          dataMapping: e.target.value,
                        });
                        if (e.target.value) {
                          showNotificationMessage(
                            "Data mapping configured successfully!",
                            "success"
                          );
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                        dynamicField.dataMapping
                          ? "border-green-300 focus:ring-green-500"
                          : "border-red-300 focus:ring-red-500"
                      }`}
                    >
                      <option value="">Select data source...</option>
                      {dataMappings.map((mapping) => (
                        <option key={mapping.value} value={mapping.value}>
                          {mapping.label}
                        </option>
                      ))}
                    </select>
                    {!dynamicField.dataMapping && (
                      <p className="text-red-500 text-xs mt-1">
                        ⚠️ Data mapping is required
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Field Name (Backend)
                    </label>
                    <input
                      type="text"
                      value={dynamicField.fieldName}
                      onChange={(e) =>
                        updateDynamicField(selectedElement, {
                          fieldName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="field_name"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={dynamicField.required}
                        onChange={(e) =>
                          updateDynamicField(selectedElement, {
                            required: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Required Field
                      </span>
                    </label>
                  </div>

                  {dynamicField.fieldType === "select" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Options (one per line)
                      </label>
                      <textarea
                        value={dynamicField.options?.join("\n") || ""}
                        onChange={(e) =>
                          updateDynamicField(selectedElement, {
                            options: e.target.value
                              .split("\n")
                              .filter((opt) => opt.trim()),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        rows={4}
                        placeholder="Option 1&#10;Option 2&#10;Option 3"
                      />
                    </div>
                  )}
                </div>
              );
            }

            return null;
          })()}
        </div>
      )}
    </div>
    </>
  );
};

export default TemplateDesigner;
