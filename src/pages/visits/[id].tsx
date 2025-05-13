import React, { useState } from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Link from "next/link";
import Head from "next/head";
import { visitAPI, reportAPI, billAPI } from "../../utils/api";
import { Visit, Report, Bill } from "../../types";

export default function VisitDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const visitId = parseInt(id as string);
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("details");
  const [error, setError] = useState<string | null>(null);

  // Fetch visit details
  const { data: visit, isLoading: visitLoading } = useQuery<Visit>(
    ["visit", visitId],
    () => visitAPI.getVisitById(visitId),
    {
      enabled: !!visitId && !isNaN(visitId),
      onError: () => {
        setError("Failed to load visit details. Please try again.");
      },
    }
  );

  // Fetch reports for this visit
  const { data: reports, isLoading: reportsLoading } = useQuery<Report[]>(
    ["visitReports", visitId],
    () => reportAPI.getReportsForVisit(visitId),
    {
      enabled: !!visitId && !isNaN(visitId),
      onError: () => {
        setError("Failed to load reports for this visit.");
      },
    }
  );

  // Fetch bill for this visit
  const { data: bill, isLoading: billLoading } = useQuery<Bill>(
    ["visitBill", visitId],
    () => billAPI.getBillByVisitId(visitId),
    {
      enabled: !!visitId && !isNaN(visitId),
      onError: () => {
        // This is not a critical error since the visit might not have a bill yet
        console.error("Failed to load bill for this visit.");
      },
    }
  );

  // Download report as PDF
  const handleDownloadReport = async (reportId: number) => {
    try {
      const blob = await reportAPI.generateReportPdf(reportId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Report_${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error downloading report:", err);
      setError("Failed to download report. Please try again.");
    }
  };

  // Download bill as PDF
  const handleDownloadBill = async (billId: number) => {
    try {
      const blob = await billAPI.generateBillPdf(billId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Bill_${billId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error downloading bill:", err);
      setError("Failed to download bill. Please try again.");
    }
  };

  if (visitLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!visit && !visitLoading) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 p-6 rounded-lg max-w-md mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-red-500 mx-auto mb-4"
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
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Visit Not Found
          </h3>
          <p className="text-red-700 mb-4">
            The requested visit could not be found or may have been deleted.
          </p>
          <Link
            href="/visits"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Return to Visits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Visit Details | Medical Center Management System</title>
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
                  href="/visits"
                  className="text-gray-500 hover:text-gray-700"
                >
                  Visits
                </Link>
              </li>
              <li>
                <span className="text-gray-400 mx-1">/</span>
                <span className="text-gray-900">Visit #{visitId}</span>
              </li>
            </ol>
          </nav>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Visit #{visitId}</h1>

          <div className="space-x-2">
            <Link
              href={`/patients/${visit?.patientId}`}
              className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Patient Profile
            </Link>

            {!bill && (
              <Link
                href={`/bills/new?visitId=${visitId}`}
                className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Create Bill
              </Link>
            )}

            <Link
              href={`/reports/new?visitId=${visitId}`}
              className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
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
              New Report
            </Link>
          </div>
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

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("details")}
                className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === "details"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Visit Details
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === "reports"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Reports {reports?.length ? `(${reports.length})` : ""}
              </button>
              <button
                onClick={() => setActiveTab("billing")}
                className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === "billing"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Billing
              </button>
            </nav>
          </div>

          {/* Visit Details Tab */}
          {activeTab === "details" && visit && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-blue-800 mb-4">
                    Patient Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium text-gray-800">
                        {visit.patientName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Patient ID:</span>
                      <span className="font-medium text-gray-800">
                        {visit.patientId}
                      </span>
                    </div>
                    <div className="pt-3">
                      <Link
                        href={`/patients/${visit.patientId}`}
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        View Complete Patient History
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-green-800 mb-4">
                    Visit Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Visit ID:</span>
                      <span className="font-medium text-gray-800">
                        {visit.visitId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium text-gray-800">
                        {new Date(visit.visitDate).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Additional Information
                </h3>
                {/* This would contain any additional visit details from the backend */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-600 italic">
                    No additional information recorded for this visit.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-800">
                  Medical Reports
                </h3>
                <Link
                  href={`/reports/new?visitId=${visitId}`}
                  className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  New Report
                </Link>
              </div>

              {reportsLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
                  <p className="mt-2 text-gray-600">Loading reports...</p>
                </div>
              ) : reports?.length ? (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div
                      key={report.reportId}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                        <div>
                          <span className="font-medium text-gray-800">
                            {report.reportTypeName}
                          </span>
                          <span className="ml-3 text-sm text-gray-500">
                            {new Date(report.createdDate).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              handleDownloadReport(report.reportId)
                            }
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Download PDF
                          </button>
                          <Link
                            href={`/reports/${report.reportId}`}
                            className="text-purple-600 hover:text-purple-800"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="text-sm text-gray-600">
                          <p>Report ID: {report.reportId}</p>
                          <p>Type: {report.reportTypeName}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-400 mx-auto mb-4"
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
                  <p className="text-gray-600 mb-4">
                    No reports have been created for this visit yet.
                  </p>
                  <Link
                    href={`/reports/new?visitId=${visitId}`}
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Create New Report
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === "billing" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-800">
                  Billing Information
                </h3>
                {!bill && (
                  <Link
                    href={`/bills/new?visitId=${visitId}`}
                    className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Create Bill
                  </Link>
                )}
              </div>

              {billLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
                  <p className="mt-2 text-gray-600">
                    Loading billing information...
                  </p>
                </div>
              ) : bill ? (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                    <div>
                      <span className="font-medium text-gray-800">
                        Bill #{bill.billId}
                      </span>
                      <span className="ml-3 text-sm text-gray-500">
                        {new Date(bill.billDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex space-x-3">
                      <Link
                        href={`/bills/${bill.billId}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleDownloadBill(bill.billId)}
                        className="text-green-600 hover:text-green-800"
                      >
                        Download PDF
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Item
                          </th>
                          <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {bill.items.map((item) => (
                          <tr key={item.billItemId}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.itemDescription}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                              ${item.amount.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Total
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                            ${bill.totalAmount.toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-400 mx-auto mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <p className="text-gray-600 mb-4">
                    No bill has been created for this visit yet.
                  </p>
                  <Link
                    href={`/bills/new?visitId=${visitId}`}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Create New Bill
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
