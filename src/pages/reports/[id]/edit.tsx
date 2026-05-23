import React, { useState } from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "react-query";
import Head from "next/head";
import Link from "next/link";
import { reportAPI, reportTypeAPI } from "../../../utils/api";
import { formatDate } from "../../../utils/date";
import ReportEditor from "../../../components/reports/ReportEditor";
import { FaArrowLeft } from "react-icons/fa";

const EditReportPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const reportId = id ? parseInt(id as string) : undefined;
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { data: report, isLoading: isLoadingReport, error: fetchError } = useQuery(
    ["report", reportId],
    () => reportAPI.getReportById(reportId as number),
    { enabled: !!reportId }
  );

  const { data: reportType, isLoading: isLoadingType } = useQuery(
    ["reportType", report?.reportTypeId],
    () => reportTypeAPI.getReportTypeById(report!.reportTypeId),
    { enabled: !!report?.reportTypeId }
  );

  const updateMutation = useMutation(
    (reportData: any) => reportAPI.updateReport(reportId!, reportData),
    {
      onSuccess: () => {
        setSuccess("Report updated successfully!");
        setTimeout(() => router.push(`/reports/${reportId}`), 1500);
      },
      onError: (err: any) => {
        setError(err.response?.data?.message || "Failed to update report.");
      },
    }
  );

  const isLoading = isLoadingReport || isLoadingType;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (fetchError || !report) {
    return (
      <div className="space-y-4">
        <Link href="/reports" className="flex items-center text-sm text-gray-500 hover:text-gray-700 gap-1.5">
          <FaArrowLeft className="h-3.5 w-3.5" /> Back to Reports
        </Link>
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-4 rounded-lg">
          Report not found.
        </div>
      </div>
    );
  }

  return (
    <>
      <Head><title>Edit Report #{report.reportId} | Medical Center</title></Head>

      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href={`/reports/${reportId}`}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700 gap-1.5"
          >
            <FaArrowLeft className="h-3.5 w-3.5" /> Back
          </Link>
          <div className="h-4 w-px bg-gray-300" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Edit Report</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {report.reportTypeName} · {report.patientName || `Visit #${report.visitId}`} · {formatDate(report.createdDate)}
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">{success}</div>
        )}

        {reportType ? (
          <ReportEditor
            initialReport={report}
            reportType={reportType}
            onSave={async (data) => {
              await updateMutation.mutateAsync(data);
            }}
          />
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm px-4 py-3 rounded-lg">
            Could not load the report type. Editing is unavailable.
          </div>
        )}
      </div>
    </>
  );
};

export default EditReportPage;
