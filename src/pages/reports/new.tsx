import React, { useState } from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "react-query";
import Head from "next/head";
import Link from "next/link";
import { reportAPI, reportTypeAPI, visitAPI } from "../../utils/api";
import ReportEditor from "../../components/reports/ReportEditor";
import { ReportType } from "../../types";
import { formatDateTime } from "../../utils/date";
import { FaSearch, FaArrowLeft, FaFileAlt, FaUser, FaClock } from "react-icons/fa";

const NewReportPage: React.FC = () => {
  const router = useRouter();
  const { visitId, reportTypeId } = router.query;
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedReportType, setSelectedReportType] = useState<ReportType | null>(null);
  const [search, setSearch] = useState("");

  const parsedVisitId = visitId ? parseInt(visitId as string) : undefined;
  const parsedReportTypeId = reportTypeId ? parseInt(reportTypeId as string) : undefined;

  const { data: reportTypes, isLoading: isReportTypesLoading } = useQuery(
    "reportTypes",
    reportTypeAPI.getAllReportTypes
  );

  const { data: visit, isLoading: isVisitLoading } = useQuery(
    ["visit", parsedVisitId],
    () => visitAPI.getVisitById(parsedVisitId as number),
    { enabled: !!parsedVisitId }
  );

  useQuery(
    ["reportType", parsedReportTypeId],
    () => reportTypeAPI.getReportTypeById(parsedReportTypeId as number),
    {
      enabled: !!parsedReportTypeId,
      onSuccess: (data) => setSelectedReportType(data),
    }
  );

  const createReportMutation = useMutation(
    ({ visitId, reportData }: { visitId: number; reportData: any }) =>
      reportAPI.createReport(visitId, reportData),
    {
      onSuccess: (data) => {
        setSuccess("Report created successfully!");
        setError(null);
        setTimeout(() => router.push(`/reports/${data.reportId}`), 1500);
      },
      onError: (err: any) => {
        setError(err.response?.data?.message || "Failed to create report. Please try again.");
        setSuccess(null);
      },
    }
  );

  const handleSaveReport = async (reportData: any) => {
    if (!parsedVisitId || !selectedReportType) {
      setError("Missing visit ID or report type.");
      return;
    }
    await createReportMutation.mutateAsync({
      visitId: parsedVisitId,
      reportData: { reportTypeId: selectedReportType.reportTypeId, reportData },
    });
  };

  const filteredTypes: ReportType[] = (reportTypes ?? []).filter((rt: ReportType) =>
    rt.reportName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Head><title>New Report | Medical Center</title></Head>

      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={parsedVisitId ? `/visits/${parsedVisitId}` : "/visits"}
              className="flex items-center text-sm text-gray-500 hover:text-gray-700 gap-1.5"
            >
              <FaArrowLeft className="h-3.5 w-3.5" /> Back
            </Link>
            <div className="h-4 w-px bg-gray-300" />
            <h1 className="text-xl font-bold text-gray-900">New Report</h1>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* No visit selected */}
        {!parsedVisitId && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm px-4 py-4 rounded-lg flex items-center justify-between">
            <span>Select a visit to create a report for.</span>
            <Link href="/visits" className="text-sm text-blue-600 hover:underline">Browse Visits</Link>
          </div>
        )}

        {/* Visit context card */}
        {parsedVisitId && (
          <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <FaUser className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              {isVisitLoading ? (
                <p className="text-sm text-gray-400">Loading visit…</p>
              ) : visit ? (
                <>
                  <p className="text-sm font-semibold text-gray-900">{visit.patientName}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <FaClock className="h-3 w-3" />
                    {formatDateTime(visit.visitDate)}
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-400">Visit #{parsedVisitId}</p>
              )}
            </div>
          </div>
        )}

        {/* Report type selection */}
        {parsedVisitId && !selectedReportType && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-800">Select Report Type</h2>
              {reportTypes?.length > 0 && (
                <span className="text-xs text-gray-400">{filteredTypes.length} of {reportTypes.length}</span>
              )}
            </div>

            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search report types…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {isReportTypesLoading ? (
              <div className="py-10 text-center text-sm text-gray-400">Loading report types…</div>
            ) : filteredTypes.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-400">
                {search ? `No report types match "${search}".` : "No report types available."}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
                {filteredTypes.map((rt: ReportType) => (
                  <button
                    key={rt.reportTypeId}
                    onClick={() => setSelectedReportType(rt)}
                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <FaFileAlt className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">{rt.reportName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {rt.reportTemplate?.fields?.length ?? 0} fields
                      </p>
                    </div>
                    <span className="text-xs text-blue-600 font-medium">Select →</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Selected report type — show change option */}
        {parsedVisitId && selectedReportType && !success && (
          <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5">
            <span className="text-sm text-blue-800 font-medium">{selectedReportType.reportName}</span>
            <button
              onClick={() => setSelectedReportType(null)}
              className="text-xs text-blue-600 hover:underline"
            >
              Change
            </button>
          </div>
        )}

        {/* Report editor */}
        {parsedVisitId && selectedReportType && (
          <ReportEditor reportType={selectedReportType} onSave={handleSaveReport} />
        )}
      </div>
    </>
  );
};

export default NewReportPage;
