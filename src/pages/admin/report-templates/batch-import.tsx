import React, { useState } from "react";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import Head from "next/head";
import Link from "next/link";
import { reportTypeAPI } from "../../../utils/api";
import { createLabTemplates } from "../../../labTemplateCreator";

const BatchImportLabTemplatesPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [importedCount, setImportedCount] = useState(0);

  // Create mutation for creating report types
  const createReportTypeMutation = useMutation(
    (reportTypeData: any) => reportTypeAPI.createReportType(reportTypeData),
    {
      onSuccess: () => {
        setImportedCount((prev) => prev + 1);
      },
      onError: (err: any) => {
        console.error("Error creating report type:", err);
        setError(
          "An error occurred while importing templates. Check console for details."
        );
      },
    }
  );

  // Handle bulk import
  const handleImportLabTemplates = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      setImportedCount(0);

      // Get the templates
      const templates = await createLabTemplates();

      // Create each report type sequentially
      for (const template of templates) {
        await createReportTypeMutation.mutateAsync(template);
      }

      setSuccess(`Successfully imported ${importedCount} lab templates!`);
      queryClient.invalidateQueries("reportTypes");
    } catch (err: any) {
      console.error("Error in batch import:", err);
      setError(
        `Failed to import lab templates: ${err.message || "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Alternative approach - use the import lab templates feature
  const handleUseExistingImport = () => {
    router.push("/admin/report-templates/import-lab");
  };

  return (
    <>
      <Head>
        <title>
          Batch Import Lab Templates | Medical Center Management System
        </title>
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
                <span className="text-gray-900">
                  Batch Import Lab Templates
                </span>
              </li>
            </ol>
          </nav>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Batch Import Lab Templates
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
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
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

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
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
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-medium text-gray-800 mb-2">
                Import Lab Templates
              </h2>
              <p className="text-gray-600">
                This will create report templates for lab tests like ALK
                PHOSPHATASE, AMYLASE, BILIRUBIN, and other common laboratory
                tests. Each template will include fields for patient
                information, result values, reference ranges, and technician
                details.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-medium text-blue-800 mb-2">
                  Method 1: Batch Create Templates
                </h3>
                <p className="text-blue-600 mb-4">
                  Create all lab templates at once with pre-configured fields
                  and layouts.
                </p>
                <button
                  type="button"
                  onClick={handleImportLabTemplates}
                  disabled={isLoading}
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
                >
                  {isLoading ? (
                    <span className="flex items-center">
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
                      Importing... {importedCount} templates created
                    </span>
                  ) : (
                    "Import All Lab Templates"
                  )}
                </button>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <h3 className="text-lg font-medium text-purple-800 mb-2">
                  Method 2: Use Standard Import
                </h3>
                <p className="text-purple-600 mb-4">
                  Use the existing import feature to create lab templates, with
                  more control over which templates to create.
                </p>
                <button
                  type="button"
                  onClick={handleUseExistingImport}
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Go to Standard Import
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-medium text-gray-800 mb-4">
            Lab Templates to be Created
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "ALK PHOSPATASE",
              "AMYLASE",
              "BILIRUBIN",
              "CHLORIDE",
              "CHOLESTEROL",
              "C.K",
              "CREATININE",
              "ELECTROLYTE",
              "GAMMAGT",
              "FBS",
              "RBS",
              "PPBS",
              "G.T.T.",
              "G.T.T. (NORMAL)",
              "G.T.T. (SPOT)",
              "POTASSIUM",
              "PROTEIN",
              "ACETONE",
              "ALBUMIN",
              "S.G.O.T. (AST)",
              "S.G.P.T. (ALT)",
            ].map((testName, index) => (
              <div key={index} className="p-3 bg-gray-50 border rounded-md">
                <span className="font-medium">{testName}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BatchImportLabTemplatesPage;
