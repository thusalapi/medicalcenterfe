import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { reportTypeAPI } from "../../../utils/api";
import { ReportType, CreateReportTypeRequest } from "../../../types";
import ReportTemplateDesigner from "../../../components/reports/ReportTemplateDesigner";

export default function NewReportTemplatePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [reportName, setReportName] = useState("");
  const [fields, setFields] = useState([
    {
      id: `field_${Date.now()}`,
      label: "Patient Name",
      type: "text",
      x: 10,
      y: 10,
      fontSize: 12,
      bold: false,
      showLabel: true,
    },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create mutation
  const createReportType = useMutation(
    (newReportType: CreateReportTypeRequest) =>
      reportTypeAPI.createReportType(newReportType),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("reportTypes");
        router.push("/admin/report-templates");
      },
      onError: (error) => {
        setError("Failed to create report template. Please try again.");
        setIsSubmitting(false);
      },
    }
  );

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!reportName.trim()) {
      setError("Please enter a report template name");
      return;
    }

    if (!fields.length) {
      setError("Please add at least one field to the report template");
      return;
    }

    setIsSubmitting(true);

    const reportTemplate = {
      paperSize: "A4",
      orientation: "portrait",
      fields: fields,
    };

    createReportType.mutate({
      reportName: reportName.trim(),
      reportTemplate: reportTemplate,
    });
  };

  // Handle fields update from the designer component
  const handleFieldsChange = (updatedFields: any[]) => {
    setFields(updatedFields);
  };

  // Add a new field to the template
  const handleAddField = (type: string) => {
    const newField = {
      id: `field_${Date.now()}`,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      type: type,
      x: 10,
      y: fields.length > 0 ? fields[fields.length - 1].y + 40 : 10,
      fontSize: 12,
      bold: false,
      showLabel: true,
    };

    setFields([...fields, newField]);
  };

  return (
    <>
      <Head>
        <title>Create Report Template | Medical Center Management System</title>
      </Head>

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700">
                  Dashboard
                </Link>
              </li>
              <li>
                <span className="text-gray-400 mx-1">/</span>
                <Link
                  href="/admin"
                  className="text-gray-500 hover:text-gray-700"
                >
                  Admin
                </Link>
              </li>
              <li>
                <span className="text-gray-400 mx-1">/</span>
                <Link
                  href="/admin/report-templates"
                  className="text-gray-500 hover:text-gray-700"
                >
                  Report Templates
                </Link>
              </li>
              <li>
                <span className="text-gray-400 mx-1">/</span>
                <span className="text-gray-900">New Template</span>
              </li>
            </ol>
          </nav>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Create New Report Template
          </h1>

          <Link
            href="/admin/report-templates"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Template Details
            </h2>

            <div className="mb-4">
              <label
                htmlFor="reportName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Template Name
              </label>
              <input
                type="text"
                id="reportName"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="e.g., Blood Test Report"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Paper Size
              </label>
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                defaultValue="A4"
              >
                <option value="A4">A4 (210 × 297 mm)</option>
                <option value="Letter">Letter (8.5 × 11 inches)</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Orientation
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    id="orientation-portrait"
                    name="orientation"
                    type="radio"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    defaultChecked
                  />
                  <label
                    htmlFor="orientation-portrait"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Portrait
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="orientation-landscape"
                    name="orientation"
                    type="radio"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label
                    htmlFor="orientation-landscape"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Landscape
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Template Designer
              </h2>

              <div className="flex space-x-2">
                <div className="relative inline-block text-left">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 border border-transparent rounded-md hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    id="add-field-menu"
                    onClick={() => handleAddField("text")}
                  >
                    Add Text Field
                  </button>
                </div>

                <div className="relative inline-block text-left">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    id="add-field-menu"
                    onClick={() => handleAddField("number")}
                  >
                    Add Number Field
                  </button>
                </div>

                <div className="relative inline-block text-left">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-green-700 bg-green-100 border border-transparent rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    id="add-field-menu"
                    onClick={() => handleAddField("date")}
                  >
                    Add Date Field
                  </button>
                </div>
              </div>
            </div>

            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 min-h-[600px] relative">
              <ReportTemplateDesigner
                fields={fields}
                onChange={handleFieldsChange}
                onSave={() => {}}
              />
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Template...
                  </span>
                ) : (
                  "Create Template"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
