import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Link from "next/link";
import Head from "next/head";
import { reportTypeAPI } from "../../../utils/api";
import { ReportType } from "../../../types";

const ReportTemplatesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportType | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch all report templates
  const { data: reportTypes, isLoading } = useQuery<ReportType[]>(
    "reportTypes",
    reportTypeAPI.getAllReportTypes,
    {
      onError: () => {
        setError("Failed to load report templates. Please try again later.");
      },
    }
  );

  // Delete report template mutation
  const deleteReportType = useMutation(
    (id: number) => reportTypeAPI.deleteReportType(id),
    {
      onSuccess: () => {
        // Invalidate and refetch the report types query
        queryClient.invalidateQueries("reportTypes");
        setIsDeleteModalOpen(false);
        setSelectedTemplate(null);
      },
      onError: () => {
        setError(
          "Failed to delete report template. It may be in use by existing reports."
        );
      },
    }
  );

  // Confirm delete handler
  const handleDelete = (reportTypeId: number, reportName: string) => {
    const template = reportTypes?.find(
      (rt) => rt.reportTypeId === reportTypeId
    );
    if (template) {
      setSelectedTemplate(template);
      setIsDeleteModalOpen(true);
    }
  };

  // Execute delete
  const confirmDelete = () => {
    if (selectedTemplate) {
      deleteReportType.mutate(selectedTemplate.reportTypeId);
    }
  };

  return (
    <>
      <Head>
        <title>Report Templates | Medical Center Management System</title>
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
                <span className="text-gray-900">Report Templates</span>
              </li>
            </ol>
          </nav>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Report Templates
            </h1>
            <p className="text-gray-600 mt-1">
              Manage report templates for medical records
            </p>
          </div>
          <Link
            href="/admin/report-templates/new"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Template
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

        {isLoading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-purple-500 border-t-transparent"></div>
            <p className="mt-3 text-gray-600">Loading report templates...</p>
          </div>
        ) : reportTypes?.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-10 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-400 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No report templates found
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first report template to start generating standardized
              medical reports.
            </p>
            <Link
              href="/admin/report-templates/new"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Template
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {reportTypes?.map((reportType) => (
                <li key={reportType.reportTypeId} className="hover:bg-gray-50">
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {reportType.reportName}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {reportType.reportTemplate?.fields?.length || 0}{" "}
                        field(s)
                      </p>
                    </div>
                    <div className="space-x-2">
                      <Link
                        href={`/admin/report-templates/${reportType.reportTypeId}`}
                        className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Edit
                      </Link>
                      <button
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                        onClick={() =>
                          handleDelete(
                            reportType.reportTypeId,
                            reportType.reportName
                          )
                        }
                        disabled={deleteReportType.isLoading}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && selectedTemplate && (
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                onClick={() => setIsDeleteModalOpen(false)}
              ></div>

              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg
                        className="h-6 w-6 text-red-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Delete Report Template
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete the "
                          {selectedTemplate.reportName}" template? This action
                          cannot be undone and may affect any reports that use
                          this template.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={confirmDelete}
                    disabled={deleteReportType.isLoading}
                  >
                    {deleteReportType.isLoading ? "Deleting..." : "Delete"}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ReportTemplatesPage;
