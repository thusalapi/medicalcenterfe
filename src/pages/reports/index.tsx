import React, { useState } from "react";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { reportAPI, reportTypeAPI } from "../../utils/api";
import { Report, ReportType } from "../../types";

export default function ReportsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // Fetch all report types for filter dropdown
  const { data: reportTypes } = useQuery<ReportType[]>(
    "reportTypes",
    reportTypeAPI.getAllReportTypes
  );

  // Fetch reports - In a real application, you'd have an API endpoint with search/filter parameters
  // For now, we'll fetch all and filter on the client side
  const {
    data: reports,
    isLoading,
    error,
  } = useQuery<Report[]>("allReports", async () => {
    // This would be replaced with an API call like:
    // reportAPI.searchReports({ searchTerm, reportTypeId: selectedType, startDate, endDate })

    // Mock data for demonstration
    return [
      {
        reportId: 1,
        visitId: 101,
        reportTypeId: 1,
        reportTypeName: "Blood Test",
        reportData: { bloodSugar: "120 mg/dL", cholesterol: "180 mg/dL" },
        createdDate: "2023-01-15T09:30:00",
        lastModifiedDate: "2023-01-15T09:30:00",
      },
      {
        reportId: 2,
        visitId: 102,
        reportTypeId: 2,
        reportTypeName: "X-Ray Report",
        reportData: {
          findings: "No abnormalities detected",
          recommendations: "Follow-up in 6 months",
        },
        createdDate: "2023-02-03T14:15:00",
        lastModifiedDate: "2023-02-03T16:20:00",
      },
      {
        reportId: 3,
        visitId: 103,
        reportTypeId: 1,
        reportTypeName: "Blood Test",
        reportData: { bloodSugar: "140 mg/dL", cholesterol: "220 mg/dL" },
        createdDate: "2023-02-18T11:45:00",
        lastModifiedDate: "2023-02-18T11:45:00",
      },
      {
        reportId: 4,
        visitId: 104,
        reportTypeId: 3,
        reportTypeName: "General Checkup",
        reportData: {
          bloodPressure: "120/80 mmHg",
          heartRate: "72 bpm",
          weight: "68 kg",
        },
        createdDate: "2023-03-05T10:00:00",
        lastModifiedDate: "2023-03-05T10:30:00",
      },
      {
        reportId: 5,
        visitId: 105,
        reportTypeId: 2,
        reportTypeName: "X-Ray Report",
        reportData: {
          findings: "Mild joint effusion",
          recommendations: "Physical therapy recommended",
        },
        createdDate: "2023-03-22T16:00:00",
        lastModifiedDate: "2023-03-23T09:15:00",
      },
    ];
  });

  // Filter reports based on search term, type, and date range
  const filteredReports =
    reports?.filter((report) => {
      // Filter by search term
      const matchesSearch =
        searchTerm === "" ||
        report.reportTypeName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        report.reportId.toString().includes(searchTerm);

      // Filter by report type
      const matchesType =
        selectedType === null || report.reportTypeId === selectedType;

      // Filter by date range
      const reportDate = new Date(report.createdDate);
      const startDate = dateRange.start ? new Date(dateRange.start) : null;
      const endDate = dateRange.end ? new Date(dateRange.end) : null;

      const matchesStartDate = startDate ? reportDate >= startDate : true;
      const matchesEndDate = endDate ? reportDate <= endDate : true;

      return matchesSearch && matchesType && matchesStartDate && matchesEndDate;
    }) || [];

  // Handler for downloading report as PDF
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
    }
  };

  return (
    <>
      <Head>
        <title>Medical Reports | Medical Center Management System</title>
      </Head>

      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Medical Reports</h1>
        </div>

        {/* Search and Filter Tools */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search by report type or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="reportType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Report Type
              </label>
              <select
                id="reportType"
                className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={selectedType || ""}
                onChange={(e) =>
                  setSelectedType(
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
              >
                <option value="">All Types</option>
                {reportTypes?.map((type) => (
                  <option key={type.reportTypeId} value={type.reportTypeId}>
                    {type.reportName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="dateRange"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                />
                <input
                  type="date"
                  className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Reports Listing */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
              <p className="mt-3 text-gray-600">Loading reports...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-red-500 mx-auto mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-lg text-red-500 font-medium">
                Failed to load reports
              </p>
              <p className="text-gray-600 mt-1">Please try again later</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-gray-400 mx-auto mb-3"
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
              <p className="text-lg font-medium">No reports found</p>
              <p className="text-gray-600 mt-1">
                Try adjusting your search filters
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Report Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Visit ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.map((report) => (
                    <tr key={report.reportId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.reportId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {report.reportTypeName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(report.createdDate).toLocaleDateString()}
                        <span className="text-xs text-gray-400 ml-1">
                          {new Date(report.createdDate).toLocaleTimeString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Link
                          href={`/visits/${report.visitId}`}
                          className="hover:text-blue-600 hover:underline"
                        >
                          {report.visitId}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                        <Link
                          href={`/reports/${report.reportId}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDownloadReport(report.reportId)}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
