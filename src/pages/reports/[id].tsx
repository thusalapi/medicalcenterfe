import React, { useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import Head from "next/head";
import Link from "next/link";
import { reportAPI } from "../../utils/api";
import { formatDate, formatDateTime } from "../../utils/date";
import {
  FaFileAlt, FaDownload, FaPrint, FaEdit, FaArrowLeft,
  FaUser, FaClock, FaTag,
} from "react-icons/fa";

const ReportDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const reportId = id ? parseInt(id as string) : undefined;
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const { data: report, isLoading, error } = useQuery(
    ["report", reportId],
    () => reportAPI.getReportById(reportId as number),
    { enabled: !!reportId }
  );

  const { data: reportDataWithLabels } = useQuery(
    ["reportDataWithLabels", reportId],
    () => reportAPI.getReportDataWithLabels(reportId as number),
    { enabled: !!reportId }
  );

  const handleDownloadPdf = async () => {
    if (!reportId) return;
    setIsGeneratingPdf(true);
    try {
      const blob = await reportAPI.generateReportPdf(reportId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Failed to generate PDF.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="space-y-4">
        <Link href="/reports" className="flex items-center text-sm text-gray-500 hover:text-gray-700 gap-1.5">
          <FaArrowLeft className="h-3.5 w-3.5" /> Back to Reports
        </Link>
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-4 rounded-lg">
          Report not found or failed to load.
        </div>
      </div>
    );
  }

  // report data rendering
  const renderContent = () => {
    const data = report.reportData;
    if (!data) return <p className="text-gray-400 text-sm italic">No content.</p>;

    if (typeof data === "string") {
      return <div dangerouslySetInnerHTML={{ __html: data }} />;
    }
    if (data.content && typeof data.content === "string") {
      return <div dangerouslySetInnerHTML={{ __html: data.content }} />;
    }

    const entries = reportDataWithLabels && Object.keys(reportDataWithLabels).length > 0
      ? Object.entries(reportDataWithLabels)
      : Object.entries(data);

    if (entries.length === 0) return <p className="text-gray-400 text-sm italic">No data fields.</p>;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {entries.map(([key, value]) => (
          <div key={key} className="bg-gray-50 rounded-lg px-4 py-3">
            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{key}</dt>
            <dd className="text-sm text-gray-900">
              {value !== null && value !== undefined && String(value).trim()
                ? String(value)
                : <span className="text-gray-400 italic">—</span>}
            </dd>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Head><title>Report #{report.reportId} | Medical Center</title></Head>

      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/reports" className="flex items-center text-sm text-gray-500 hover:text-gray-700 gap-1.5">
              <FaArrowLeft className="h-3.5 w-3.5" /> Back
            </Link>
            <div className="h-4 w-px bg-gray-300" />
            <h1 className="text-xl font-bold text-gray-900">
              {report.reportTypeName || "Report"} #{report.reportId}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <FaPrint className="h-3.5 w-3.5" /> Print
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <FaDownload className="h-3.5 w-3.5" />
              {isGeneratingPdf ? "Generating…" : "PDF"}
            </button>
            <Link
              href={`/reports/${report.reportId}/edit`}
              className="flex items-center gap-1.5 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FaEdit className="h-3.5 w-3.5" /> Edit
            </Link>
          </div>
        </div>

        {/* Meta card */}
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <FaUser className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Patient</p>
              <p className="font-medium text-gray-900">{report.patientName || "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Visit date</p>
              <p className="font-medium text-gray-900">{formatDateTime(report.visitDate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FaTag className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Type</p>
              <p className="font-medium text-gray-900">{report.reportTypeName || "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FaFileAlt className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Created</p>
              <p className="font-medium text-gray-900">{formatDate(report.createdDate)}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">Report Content</h2>
          </div>
          <div className="p-5">{renderContent()}</div>
        </div>
      </div>
    </>
  );
};

export default ReportDetailPage;
