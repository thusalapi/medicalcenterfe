import React, { useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { reportAPI } from "../../utils/api";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import {
  FaFileAlt,
  FaDownload,
  FaPrint,
  FaEdit,
  FaArrowLeft,
  FaCalendar,
  FaUser,
  FaStethoscope,
} from "react-icons/fa";

const ReportDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const reportId = id ? parseInt(id as string) : undefined;

  // Fetch report details
  const {
    data: report,
    isLoading,
    error,
  } = useQuery(
    ["report", reportId],
    () => reportAPI.getReportById(reportId as number),
    {
      enabled: !!reportId,
      onError: (err: any) => {
        console.error("Failed to fetch report:", err);
      },
    }
  );

  // Fetch report data with human-readable labels
  const { data: reportDataWithLabels, isLoading: isLoadingLabels } = useQuery(
    ["reportDataWithLabels", reportId],
    () => reportAPI.getReportDataWithLabels(reportId as number),
    {
      enabled: !!reportId,
      onError: (err: any) => {
        console.error("Failed to fetch report data with labels:", err);
      },
    }
  );

  const handleGeneratePdf = async () => {
    if (!reportId) return;

    setIsGeneratingPdf(true);
    try {
      const pdfBlob = await reportAPI.generateReportPdf(reportId);

      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `report-${reportId}.pdf`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleGenerateFormattedPdf = async () => {
    if (!reportId) return;

    setIsGeneratingPdf(true);
    try {
      const pdfBlob = await reportAPI.generateReportPdfWithLabels(reportId);

      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `report-${reportId}-formatted.pdf`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to generate formatted PDF:", error);
      alert("Failed to generate formatted PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEdit = () => {
    router.push(`/reports/${reportId}/edit`);
  };

  const handleBackToList = () => {
    router.push("/reports");
  };

  if (isLoading || isLoadingLabels) {
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

  if (error || !report) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8">
              <FaFileAlt className="mx-auto h-12 w-12 text-red-400 mb-4" />
              <h2 className="text-xl font-semibold text-red-800 mb-2">
                Report Not Found
              </h2>
              <p className="text-red-600 mb-4">
                The requested report could not be found or you don't have
                permission to view it.
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
              onClick={handleBackToList}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Reports
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Report Details</h1>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleEdit}
              className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
            >
              <FaEdit className="mr-2" />
              Edit
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <FaPrint className="mr-2" />
              Print
            </button>

            <button
              onClick={handleGeneratePdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGeneratingPdf ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <FaDownload className="mr-2" />
              )}
              {isGeneratingPdf ? "Generating..." : "Download PDF"}
            </button>

            <button
              onClick={handleGenerateFormattedPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGeneratingPdf ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <FaDownload className="mr-2" />
              )}
              {isGeneratingPdf ? "Generating..." : "Formatted PDF"}
            </button>
          </div>
        </div>

        {/* Report Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <FaFileAlt className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Report ID</p>
                <p className="font-semibold">{report.reportId}</p>
              </div>
            </div>

            <div className="flex items-center">
              <FaUser className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Patient</p>
                <p className="font-semibold">
                  {report.patient
                    ? `${report.patient.firstName} ${report.patient.lastName}`
                    : "Unknown Patient"}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <FaCalendar className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Created Date</p>
                <p className="font-semibold">
                  {report.createdAt
                    ? new Date(report.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>

            {report.visit && (
              <div className="flex items-center">
                <FaStethoscope className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Visit Date</p>
                  <p className="font-semibold">
                    {new Date(report.visit.visitDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            {report.reportType && (
              <div className="flex items-center">
                <FaFileAlt className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Report Type</p>
                  <p className="font-semibold">{report.reportType.typeName}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Report Content */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Report Content
            </h2>
          </div>

          <div className="p-6">
            {report.reportData ? (
              <div className="prose max-w-none">
                {typeof report.reportData === "string" ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: report.reportData }}
                  />
                ) : (
                  <div className="space-y-4">
                    {typeof report.reportData === "object" &&
                    report.reportData.content ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: report.reportData.content,
                        }}
                      />
                    ) : (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          Report Data:
                        </h3>
                        {/* Display with human-readable field names if available */}
                        {reportDataWithLabels &&
                        Object.keys(reportDataWithLabels).length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(reportDataWithLabels).map(
                              ([fieldLabel, value]) => (
                                <div
                                  key={fieldLabel}
                                  className="bg-gray-50 p-4 rounded-md"
                                >
                                  <dt className="text-sm font-medium text-gray-500 mb-1">
                                    {fieldLabel}
                                  </dt>
                                  <dd className="text-sm text-gray-900">
                                    {value !== null &&
                                    value !== undefined &&
                                    value !== "" ? (
                                      String(value)
                                    ) : (
                                      <span className="text-gray-400 italic">
                                        Not specified
                                      </span>
                                    )}
                                  </dd>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <pre className="bg-gray-50 p-4 rounded-md text-sm overflow-auto">
                            {JSON.stringify(report.reportData, null, 2)}
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaFileAlt className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500">No report content available</p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        {(report.notes || report.diagnosis) && (
          <div className="bg-white rounded-lg shadow-md mt-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Additional Information
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {report.diagnosis && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Diagnosis</h4>
                  <p className="text-gray-700">{report.diagnosis}</p>
                </div>
              )}
              {report.notes && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                  <p className="text-gray-700">{report.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }

          body {
            background: white !important;
          }

          .container {
            max-width: none !important;
            padding: 0 !important;
          }

          .shadow-md {
            box-shadow: none !important;
            border: 1px solid #e5e7eb !important;
          }
        }
      `}</style>
    </Layout>
  );
};

export default ReportDetailPage;
