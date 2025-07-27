import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "react-query";
import { reportAPI } from "../../../utils/api";
import Layout from "../../../components/Layout";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import ReportEditor from "../../../components/reports/ReportEditor";
import { FaArrowLeft, FaTimes } from "react-icons/fa";

const EditReportPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const reportId = id ? parseInt(id as string) : undefined;

  // Fetch report details
  const {
    data: report,
    isLoading,
    error: fetchError,
  } = useQuery(
    ["report", reportId],
    () => reportAPI.getReportById(reportId as number),
    {
      enabled: !!reportId,
      onError: (err: any) => {
        setError("Failed to fetch report details");
        console.error("Failed to fetch report:", err);
      },
    }
  );

  // Update report mutation
  const updateReportMutation = useMutation(
    ({ reportId, reportData }: { reportId: number; reportData: any }) =>
      reportAPI.updateReport(reportId, reportData),
    {
      onSuccess: () => {
        setSuccess("Report updated successfully!");
        setError(null);

        // Redirect back to report view after a short delay
        setTimeout(() => {
          router.push(`/reports/${reportId}`);
        }, 1500);
      },
      onError: (err: any) => {
        setError(
          err.response?.data?.message ||
            "Failed to update report. Please try again."
        );
        setSuccess(null);
      },
    }
  );

  const handleCancel = () => {
    router.push(`/reports/${reportId}`);
  };

  const handleBackToList = () => {
    router.push("/reports");
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-64">
            <LoadingSpinner />
          </div>
        </div>
      </Layout>
    );
  }

  if (fetchError || !report) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8">
              <h2 className="text-xl font-semibold text-red-800 mb-2">
                Report Not Found
              </h2>
              <p className="text-red-600 mb-4">
                The requested report could not be found or you don't have
                permission to edit it.
              </p>
              <button
                onClick={handleBackToList}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                Back to Reports
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <button
              onClick={() => router.push(`/reports/${reportId}`)}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Report
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Edit Report</h1>
            <p className="text-gray-600 mt-1">
              Report ID: {reportId} • Patient:{" "}
              {report.patient
                ? `${report.patient.firstName} ${report.patient.lastName}`
                : "Unknown Patient"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <FaTimes className="mr-2" />
              Cancel
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Report Editor */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Report Content
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Edit the report content below. Changes will be saved when you
              click "Save Changes".
            </p>
          </div>

          <div className="p-6">
            <ReportEditor
              initialReport={report}
              reportType={report.reportType}
              onSave={async (data) => {
                await updateReportMutation.mutateAsync({
                  reportId: reportId!,
                  reportData: { ...report, reportData: data },
                });
              }}
            />
          </div>
        </div>

        {/* Report Information */}
        <div className="bg-white rounded-lg shadow-md mt-6">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Report Information
            </h3>
          </div>
          <div className="p-6">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Report Type
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {report.reportType?.typeName || "N/A"}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Created Date
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {report.createdAt
                    ? new Date(report.createdAt).toLocaleDateString()
                    : "N/A"}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Visit Date
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {report.visit?.visitDate
                    ? new Date(report.visit.visitDate).toLocaleDateString()
                    : "N/A"}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Last Updated
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {report.updatedAt
                    ? new Date(report.updatedAt).toLocaleDateString()
                    : "N/A"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditReportPage;
