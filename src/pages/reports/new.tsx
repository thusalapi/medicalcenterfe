import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "react-query";
import { reportAPI, reportTypeAPI, visitAPI } from "../../utils/api";
import ReportEditor from "../../components/reports/ReportEditor";
import { ReportType } from "../../types";

const NewReportPage: React.FC = () => {
  const router = useRouter();
  const { visitId, reportTypeId } = router.query;
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedReportType, setSelectedReportType] =
    useState<ReportType | null>(null);

  // Check if parameters exist in the URL
  const parsedVisitId = visitId ? parseInt(visitId as string) : undefined;
  const parsedReportTypeId = reportTypeId
    ? parseInt(reportTypeId as string)
    : undefined;

  // Fetch available report templates
  const { data: reportTypes, isLoading: isReportTypesLoading } = useQuery(
    "reportTypes",
    reportTypeAPI.getAllReportTypes
  );

  // Fetch visit information
  const { data: visit, isLoading: isVisitLoading } = useQuery(
    ["visit", parsedVisitId],
    () => visitAPI.getVisitById(parsedVisitId as number),
    {
      enabled: !!parsedVisitId,
      onError: () => {
        setError("Failed to fetch visit information. Please try again.");
      },
    }
  );

  // Fetch specific report type if specified in URL
  const { data: specificReportType, isLoading: isSpecificReportTypeLoading } =
    useQuery(
      ["reportType", parsedReportTypeId],
      () => reportTypeAPI.getReportTypeById(parsedReportTypeId as number),
      {
        enabled: !!parsedReportTypeId,
        onSuccess: (data) => {
          setSelectedReportType(data);
        },
        onError: () => {
          setError("Failed to fetch report template. Please try again.");
        },
      }
    );

  // Create report mutation
  const createReportMutation = useMutation(
    ({ visitId, reportData }: { visitId: number; reportData: any }) =>
      reportAPI.createReport(visitId, reportData),
    {
      onSuccess: (data) => {
        setSuccess("Report created successfully!");
        setError(null);

        // Redirect to report view after a short delay
        setTimeout(() => {
          router.push(`/reports/${data.reportId}`);
        }, 1500);
      },
      onError: (err: any) => {
        setError(
          err.response?.data?.message ||
            "Failed to create report. Please try again."
        );
        setSuccess(null);
      },
    }
  );

  // Handle report type selection
  const handleReportTypeSelect = (reportType: ReportType) => {
    setSelectedReportType(reportType);
  };

  // Handle report save
  const handleSaveReport = async (reportData: any) => {
    if (!parsedVisitId || !selectedReportType) {
      setError("Missing visit ID or report type. Cannot create report.");
      return;
    }

    const createReportRequest = {
      reportTypeId: selectedReportType.reportTypeId,
      reportData: reportData,
    };

    await createReportMutation.mutateAsync({
      visitId: parsedVisitId,
      reportData: createReportRequest,
    });
  };

  // Loading state
  if (isReportTypesLoading || isVisitLoading || isSpecificReportTypeLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">New Report</h1>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">New Report</h1>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <p className="text-green-800">{success}</p>
        </div>
      )}

      {!parsedVisitId && (
        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <p className="text-yellow-800">
            Please select a visit to create a report for.
          </p>
          <button
            onClick={() => router.push("/visits")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Browse Visits
          </button>
        </div>
      )}

      {parsedVisitId && visit && (
        <div className="mb-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-blue-800">
              <strong>Creating report for:</strong> {visit.patientName} - Visit
              on {new Date(visit.visitDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      {parsedVisitId &&
        !selectedReportType &&
        reportTypes &&
        reportTypes.length > 0 && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Select Report Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportTypes.map((reportType) => (
                <div
                  key={reportType.reportTypeId}
                  className="border rounded-md p-4 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => handleReportTypeSelect(reportType)}
                >
                  <h3 className="font-medium text-lg">
                    {reportType.reportName}
                  </h3>
                  <p className="text-gray-500 text-sm mt-2">
                    {reportType.reportTemplate?.fields?.length || 0} fields
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      {parsedVisitId && selectedReportType && (
        <ReportEditor
          reportType={selectedReportType}
          onSave={handleSaveReport}
        />
      )}
    </div>
  );
};

export default NewReportPage;
