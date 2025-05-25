import React, { useState, useCallback, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  useDraggable,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { ReportField, ReportType } from "../../types";
import ChartField from "./ChartField";

interface ReportTemplateDesignerProps {
  initialTemplate?: ReportType;
  fields?: ReportField[];
  onChange?: (updatedFields: ReportField[]) => void;
  onSave: (template?: any) => void;
}

const ReportTemplateDesigner: React.FC<ReportTemplateDesignerProps> = ({
  initialTemplate,
  fields: externalFields,
  onChange,
  onSave,
}) => {
  const [reportName, setReportName] = useState<string>(
    initialTemplate?.reportName || ""
  );
  const [fields, setFields] = useState<ReportField[]>(
    externalFields || initialTemplate?.reportTemplate?.fields || []
  );

  // Update internal fields when external fields change
  useEffect(() => {
    if (externalFields) {
      setFields(externalFields);
    }
  }, [externalFields]);

  // Function to update fields and notify parent if onChange is provided
  const updateFields = useCallback(
    (newFields: ReportField[] | ((prev: ReportField[]) => ReportField[])) => {
      const updatedFields =
        typeof newFields === "function" ? newFields(fields) : newFields;
      setFields(updatedFields);
      onChange?.(updatedFields);
    },
    [fields, onChange]
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [paperSize, setPaperSize] = useState<string>(
    initialTemplate?.reportTemplate?.paperSize || "A4"
  );

  // Define the sensors for drag functionality
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Field creation with a unique id
  const createField = (type: string) => {
    const id = `field-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;
    let newField: ReportField = {
      id,
      type,
      label: getDefaultLabelByType(type),
      x: 50,
      y: 50,
      fontSize: 14,
      bold: false,
      showLabel: true,
    };

    updateFields([...fields, newField]);
  };
  // Get default label based on field type
  const getDefaultLabelByType = (type: string): string => {
    switch (type) {
      case "text":
        return "Text Field";
      case "number":
        return "Number Field";
      case "date":
        return "Date Field";
      case "checkbox":
        return "Checkbox";
      case "textarea":
        return "Text Area";
      case "heading":
        return "Report Heading";
      case "pie-chart":
        return "Pie Chart";
      case "bar-chart":
        return "Bar Chart";
      default:
        return "Field";
    }
  };

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
  };
  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;

    updateFields((fields) =>
      fields.map((field) => {
        if (field.id === active.id) {
          return {
            ...field,
            x: (field.x || 0) + delta.x,
            y: (field.y || 0) + delta.y,
          };
        }
        return field;
      })
    );

    setActiveId(null);
  };
  // Delete a field
  const handleDeleteField = (id: string) => {
    updateFields(fields.filter((field) => field.id !== id));
  };
  // Update field properties
  const updateFieldProperty = (id: string, property: string, value: any) => {
    updateFields(
      fields.map((field) => {
        if (field.id === id) {
          return { ...field, [property]: value };
        }
        return field;
      })
    );
  };

  // Save the template
  const handleSave = () => {
    const template = {
      reportName,
      reportTemplate: {
        paperSize,
        fields,
      },
    };
    onSave(template);
  };

  // Paper dimensions (in pixels) for preview
  const getPaperDimensions = () => {
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Report Template Designer</h2>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Report Name
        </label>
        <input
          type="text"
          value={reportName}
          onChange={(e) => setReportName(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter report name"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Paper Size
        </label>
        <select
          value={paperSize}
          onChange={(e) => setPaperSize(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="A4">A4</option>
          <option value="Letter">US Letter</option>
        </select>
      </div>

      <div className="flex flex-wrap mb-6">
        <div className="w-full lg:w-1/4 p-2">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Field Types</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                className="bg-blue-500 text-white py-2 px-3 rounded hover:bg-blue-600"
                onClick={() => createField("text")}
              >
                Text
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-3 rounded hover:bg-blue-600"
                onClick={() => createField("number")}
              >
                Number
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-3 rounded hover:bg-blue-600"
                onClick={() => createField("date")}
              >
                Date
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-3 rounded hover:bg-blue-600"
                onClick={() => createField("checkbox")}
              >
                Checkbox
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-3 rounded hover:bg-blue-600"
                onClick={() => createField("textarea")}
              >
                Text Area
              </button>{" "}
              <button
                className="bg-blue-500 text-white py-2 px-3 rounded hover:bg-blue-600"
                onClick={() => createField("heading")}
              >
                Heading
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-3 rounded hover:bg-blue-600"
                onClick={() => createField("pie-chart")}
              >
                Pie Chart
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-3 rounded hover:bg-blue-600"
                onClick={() => createField("bar-chart")}
              >
                Bar Chart
              </button>
            </div>
          </div>

          {activeId && (
            <div className="mt-4 bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Field Properties</h3>
              {fields
                .filter((field) => field.id === activeId)
                .map((field) => (
                  <div key={field.id} className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Label
                      </label>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) =>
                          updateFieldProperty(field.id, "label", e.target.value)
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Font Size
                      </label>
                      <input
                        type="number"
                        value={field.fontSize}
                        onChange={(e) =>
                          updateFieldProperty(
                            field.id,
                            "fontSize",
                            parseInt(e.target.value)
                          )
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        id={`bold-${field.id}`}
                        type="checkbox"
                        checked={field.bold}
                        onChange={(e) =>
                          updateFieldProperty(
                            field.id,
                            "bold",
                            e.target.checked
                          )
                        }
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`bold-${field.id}`}
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Bold
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id={`showLabel-${field.id}`}
                        type="checkbox"
                        checked={field.showLabel}
                        onChange={(e) =>
                          updateFieldProperty(
                            field.id,
                            "showLabel",
                            e.target.checked
                          )
                        }
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`showLabel-${field.id}`}
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Show Label
                      </label>
                    </div>

                    <button
                      onClick={() => handleDeleteField(field.id)}
                      className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 text-sm"
                    >
                      Delete Field
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="w-full lg:w-3/4 p-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToWindowEdges]}
          >
            <div
              className="relative bg-white border-2 border-gray-300 shadow-lg overflow-hidden mx-auto"
              style={{
                width: paperDimensions.width,
                height: paperDimensions.height,
                transform: "scale(0.7)",
                transformOrigin: "top left",
              }}
            >
              {" "}
              {fields.map((field) => (
                <DraggableField
                  key={field.id}
                  field={field}
                  isActive={activeId === field.id}
                />
              ))}
            </div>
          </DndContext>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={handleSave}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Save Template
        </button>
      </div>
    </div>
  );
};

// Draggable Field Component
interface DraggableFieldProps {
  field: ReportField;
  isActive: boolean;
}

const DraggableField: React.FC<DraggableFieldProps> = ({ field, isActive }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: field.id,
  });

  const style: React.CSSProperties = {
    position: "absolute",
    left: field.x,
    top: field.y,
    fontWeight: field.bold ? "bold" : "normal",
    fontSize: `${field.fontSize}px`,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`absolute cursor-grab border border-dashed ${
        isActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
      } p-2 rounded`}
      {...listeners}
      {...attributes}
    >
      {field.showLabel && (
        <span className="text-gray-500">{field.label}: </span>
      )}
      {field.type === "text" && "[Text Input]"}
      {field.type === "number" && "[Number Input]"}{" "}
      {field.type === "date" && "[Date Input]"}
      {field.type === "checkbox" && "[Checkbox]"}
      {field.type === "textarea" && "[Text Area]"}
      {field.type === "heading" && field.label}
      {field.type === "pie-chart" && (
        <ChartField type="pie" width={250} height={180} />
      )}
      {field.type === "bar-chart" && (
        <ChartField type="bar" width={250} height={180} />
      )}
    </div>
  );
};

export default ReportTemplateDesigner;
