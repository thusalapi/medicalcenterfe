import React, { useState } from "react";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import Head from "next/head";
import Link from "next/link";
import { reportTypeAPI } from "../../../utils/api";
import { LabTemplateImportResult } from "../../../types";

const ImportLabTemplatesPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [customTemplates, setCustomTemplates] = useState("");
  const [results, setResults] = useState<LabTemplateImportResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Mutation for importing predefined templates
  const importPredefinedMutation = useMutation(
    () => reportTypeAPI.importPredefinedLabTemplates(),
    {
      onSuccess: (data) => {
        setResults(data);
        setSuccess("Successfully imported predefined templates!");
        setError(null);
        // Invalidate report types query to refresh the list
        queryClient.invalidateQueries("reportTypes");
      },
      onError: (err: any) => {
        setError(
          "Failed to import predefined templates: " +
            (err.response?.data?.message || err.message || "Unknown error")
        );
        setSuccess(null);
      },
      onSettled: () => {
        setIsLoading(false);
      },
    }
  );
  // Mutation for creating custom templates
  const createCustomMutation = useMutation(
    (templates: string[]) => reportTypeAPI.createCustomLabTemplates(templates),
    {
      onSuccess: (data) => {
        setResults(data);
        setSuccess("Successfully created custom templates!");
        setError(null);
        // Invalidate report types query to refresh the list
        queryClient.invalidateQueries("reportTypes");
      },
      onError: (err: any) => {
        setError(
          "Failed to create custom templates: " +
            (err.response?.data?.message || err.message || "Unknown error")
        );
        setSuccess(null);
      },
      onSettled: () => {
        setIsLoading(false);
      },
    }
  );

  // Handle importing predefined templates
  const handleImportPredefined = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    importPredefinedMutation.mutate();
  };

  // Handle creating custom templates
  const handleCreateCustom = async () => {
    if (!customTemplates.trim()) {
      setError("Please enter at least one template name");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Parse template names from textarea (one per line)
    const templateNames = customTemplates
      .split("\n")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    createCustomMutation.mutate(templateNames);
  };

  return (
    <>
      <Head>
        <title>Import Lab Templates | Medical Center Management System</title>
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
                <span className="text-gray-900">Import Lab Templates</span>
              </li>
            </ol>
          </nav>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Import Laboratory Report Templates
          </h1>

          <Link
            href="/admin/report-templates"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Back to Templates
          </Link>
        </div>

        {/* Error/Success Messages */}
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
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Predefined Templates Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Import Predefined Lab Templates
            </h2>
            <p className="text-gray-600 mb-4">
              Click the button below to import all predefined laboratory report
              templates. This includes common tests like blood glucose, lipid
              profile, liver function tests, and more.
            </p>
            <button
              type="button"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
              onClick={handleImportPredefined}
              disabled={isLoading}
            >
              {isLoading && importPredefinedMutation.isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Importing...
                </span>
              ) : (
                "Import Predefined Templates"
              )}
            </button>
          </div>

          {/* Custom Templates Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Create Custom Templates
            </h2>
            <p className="text-gray-600 mb-4">
              Enter the names of custom laboratory tests (one per line) to
              create templates for each of them.
            </p>
            <div className="mb-4">
              <textarea
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={customTemplates}
                onChange={(e) => setCustomTemplates(e.target.value)}
                placeholder="Enter test names (one per line)&#10;Example:&#10;HEMOGLOBIN A1C&#10;VITAMIN D&#10;THYROID PANEL"
                disabled={isLoading}
              ></textarea>
            </div>
            <button
              type="button"
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400"
              onClick={handleCreateCustom}
              disabled={isLoading}
            >
              {isLoading && createCustomMutation.isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Creating...
                </span>
              ) : (
                "Create Custom Templates"
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Import Results
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-green-600 mb-2">
                  Successfully Created ({results.createdCount})
                </h3>
                <div className="bg-gray-50 p-4 rounded-md max-h-64 overflow-y-auto">
                  {results.created.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {results.created.map((name, index) => (
                        <li key={index} className="text-sm text-gray-700">
                          {name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      No templates were created
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-yellow-600 mb-2">
                  Skipped ({results.skippedCount})
                </h3>
                <div className="bg-gray-50 p-4 rounded-md max-h-64 overflow-y-auto">
                  {results.skipped.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {results.skipped.map((name, index) => (
                        <li key={index} className="text-sm text-gray-700">
                          {name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      No templates were skipped
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ImportLabTemplatesPage;
