import React, { useState } from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "react-query";
import { patientAPI, visitAPI, reportAPI } from "../../utils/api";
import PatientForm from "../../components/patients/PatientForm";
import Link from "next/link";

const PatientDetailsPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const patientId = id ? parseInt(id as string) : undefined;

  // Fetch patient details
  const {
    data: patient,
    isLoading: isPatientLoading,
    refetch: refetchPatient,
  } = useQuery(
    ["patient", patientId],
    () => patientAPI.getPatientById(patientId as number),
    {
      enabled: !!patientId,
      onError: () => {
        setError("Failed to fetch patient details");
      },
    }
  );

  // Fetch patient visits
  const { data: visits, isLoading: isVisitsLoading } = useQuery(
    ["patientVisits", patientId],
    () => visitAPI.getVisitsForPatient(patientId as number),
    {
      enabled: !!patientId,
      onError: () => {
        console.error("Failed to fetch patient visits");
      },
    }
  );

  // Fetch patient reports
  const { data: reports, isLoading: isReportsLoading } = useQuery(
    ["patientReports", patientId],
    () => reportAPI.getReportsForPatient(patientId as number),
    {
      enabled: !!patientId,
      onError: () => {
        console.error("Failed to fetch patient reports");
      },
    }
  );

  // Update patient mutation
  const updatePatientMutation = useMutation(
    (data: any) => patientAPI.updatePatient(patientId as number, data),
    {
      onSuccess: () => {
        setSuccess("Patient information updated successfully");
        setIsEditing(false);
        refetchPatient(); // Refresh patient data

        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      },
      onError: (err: any) => {
        setError(
          err.response?.data?.message || "Failed to update patient information"
        );
      },
    }
  );

  // Handle update patient
  const handleUpdatePatient = async (data: any) => {
    await updatePatientMutation.mutateAsync(data);
  };

  // Handle create new visit
  const handleCreateVisit = () => {
    router.push(`/visits/new?patientId=${patientId}`);
  };

  // Loading state
  if (isPatientLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading patient details...</p>
        </div>
      </div>
    );
  }

  // Patient not found
  if (!patient && !isPatientLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
          <p className="text-red-800">Patient not found</p>
        </div>
        <Link
          href="/patients"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Patients
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Patient Details</h1>
        <div className="space-x-2">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit Patient
              </button>
              <button
                onClick={handleCreateVisit}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Create Visit
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel Editing
            </button>
          )}
        </div>
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

      {isEditing ? (
        <PatientForm
          initialData={patient}
          onSubmit={handleUpdatePatient}
          isEdit={true}
        />
      ) : patient ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Information */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">
                Personal Information
              </h2>
              <div className="divide-y">
                <div className="py-3 flex justify-between">
                  <span className="font-medium text-gray-500">Name</span>
                  <span className="text-gray-900">{patient.name}</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="font-medium text-gray-500">
                    Phone Number
                  </span>
                  <span className="text-gray-900">{patient.phoneNumber}</span>
                </div>

                {/* Render other custom fields from JSON */}
                {patient.otherDetails &&
                  Object.entries(patient.otherDetails).map(([key, value]) => (
                    <div key={key} className="py-3 flex justify-between">
                      <span className="font-medium text-gray-500">
                        {key.charAt(0).toUpperCase() +
                          key.slice(1).replace(/([A-Z])/g, " $1")}
                      </span>
                      <span className="text-gray-900">
                        {typeof value === "object"
                          ? JSON.stringify(value)
                          : String(value || "-")}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Patient History */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Visit History</h2>
              {isVisitsLoading ? (
                <p className="text-gray-500 text-center py-4">
                  Loading visits...
                </p>
              ) : !visits?.length ? (
                <p className="text-gray-500 text-center py-4">
                  No visits found for this patient.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Visit Date
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {visits.map((visit) => (
                        <tr key={visit.visitId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {new Date(visit.visitDate).toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              href={`/visits/${visit.visitId}`}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              View Details
                            </Link>
                            <Link
                              href={`/reports/new?visitId=${visit.visitId}`}
                              className="text-green-600 hover:text-green-900 mr-4"
                            >
                              Add Report
                            </Link>
                            <Link
                              href={`/bills/new?visitId=${visit.visitId}`}
                              className="text-purple-600 hover:text-purple-900"
                            >
                              Create Bill
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Reports</h2>
              {isReportsLoading ? (
                <p className="text-gray-500 text-center py-4">
                  Loading reports...
                </p>
              ) : !reports?.length ? (
                <p className="text-gray-500 text-center py-4">
                  No reports found for this patient.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reports.map((report) => (
                    <div
                      key={report.reportId}
                      className="border rounded-md p-4 hover:bg-gray-50"
                    >
                      <div className="font-medium text-lg mb-1">
                        {report.reportTypeName}
                      </div>
                      <div className="text-sm text-gray-500 mb-3">
                        Created: {new Date(report.createdDate).toLocaleString()}
                      </div>
                      <div className="flex justify-end">
                        <Link
                          href={`/reports/${report.reportId}`}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          View Report
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PatientDetailsPage;
