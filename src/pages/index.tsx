import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useQuery } from "react-query";
import { visitAPI, reportAPI, billAPI } from "../utils/api";
import PatientLookup from "../components/patients/PatientLookup";
import Dashboard from "../components/dashboard/Dashboard";
import { Patient, Visit, Report } from "../types";

// Type definitions
interface SelectedPatient extends Patient {
  // Add any additional properties if selectedPatient has more than Patient
}

export default function Home() {
  const router = useRouter();
  const [selectedPatient, setSelectedPatient] =
    useState<SelectedPatient | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Only enable queries after component mounts on the client
  const enabled = isMounted;

  // Fetch recent visits for the dashboard
  const { data: recentVisits, isLoading } = useQuery<Visit[], Error>(
    "recentVisits",
    () => visitAPI.getRecentVisits(5),
    {
      refetchInterval: 30000, // Refresh every 30 seconds
      enabled,
    }
  );

  // Fetch analytics data
  const { data: visitStats } = useQuery<{ total: number; today: number }>(
    "visitStats",
    () => visitAPI.getVisitStats(),
    {
      refetchInterval: 60000, // Refresh every minute
      enabled,
    }
  );

  const { data: billStats } = useQuery<{
    totalRevenue: number;
    monthlyRevenue: number;
  }>("billStats", () => billAPI.getBillingStats(), {
    refetchInterval: 60000, // Refresh every minute
    enabled,
  });

  const { data: reportStats } = useQuery<{
    total: number;
    pendingReports: number;
  }>("reportStats", () => reportAPI.getReportStats(), {
    refetchInterval: 60000, // Refresh every minute
    enabled,
  });

  const handlePatientSelect = (patient: SelectedPatient) => {
    // Added type for patient
    setSelectedPatient(patient);
  };

  const handleCreateVisit = () => {
    if (selectedPatient) {
      router.push(`/visits/new?patientId=${selectedPatient.patientId}`);
    }
  };

  const handleViewPatientHistory = () => {
    if (selectedPatient) {
      router.push(`/patients/${selectedPatient.patientId}`);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Medical Center Dashboard</h1>

      {/* Dashboard Stats */}
      <Dashboard />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2">
          <PatientLookup onPatientSelect={handlePatientSelect} />

          {selectedPatient && (
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    Selected Patient
                  </h2>
                  <p className="text-lg">{selectedPatient.name}</p>
                  <p className="text-gray-600">{selectedPatient.phoneNumber}</p>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={handleCreateVisit}
                    className="w-full block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Create Visit
                  </button>
                  <button
                    onClick={handleViewPatientHistory}
                    className="w-full block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Patient History
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Visits</h2>
            {isLoading ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Loading...</p>
              </div>
            ) : !recentVisits?.length ? (
              <p className="text-gray-500 text-center py-4">
                No recent visits found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Patient
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
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
                    {recentVisits.map((visit) => (
                      <tr key={visit.visitId}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {visit.patientName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-600">
                            {new Date(visit.visitDate).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Link
                            href={`/visits/${visit.visitId}`}
                            className="text-blue-600 hover:text-blue-800 mr-4"
                          >
                            View
                          </Link>
                          <Link
                            href={`/bills/new?visitId=${visit.visitId}`}
                            className="text-green-600 hover:text-green-800"
                          >
                            Bill
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div>
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/patients/new"
                className="block w-full px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md text-center"
              >
                Register New Patient
              </Link>
              <Link
                href="/visits/new"
                className="block w-full px-4 py-3 bg-green-100 hover:bg-green-200 text-green-700 rounded-md text-center"
              >
                Create Visit
              </Link>
              <Link
                href="/admin/report-templates"
                className="block w-full px-4 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-md text-center"
              >
                Manage Report Templates
              </Link>
              <Link
                href="/reports"
                className="block w-full px-4 py-3 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-md text-center"
              >
                Search Reports
              </Link>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">System Information</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Version</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Database</span>
                <span className="font-medium">Connected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Backup</span>
                <span className="font-medium">Auto</span>
              </div>
              <div className="pt-4">
                <Link
                  href="/admin"
                  className="block w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-center"
                >
                  Admin Settings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
