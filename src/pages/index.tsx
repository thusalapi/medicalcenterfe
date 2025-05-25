import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useQuery } from "react-query";
import { visitAPI, reportAPI, billAPI } from "../utils/api";
import PatientLookup from "../components/patients/PatientLookup";
import Dashboard from "../components/dashboard/Dashboard";
import { Patient, Visit, Report } from "../types";
import {
  FaPlus,
  FaCalendarAlt,
  FaChartBar,
  FaUserPlus,
  FaStethoscope,
  FaClipboardList,
  FaArrowRight,
  FaClock,
  FaExclamationTriangle,
  FaCog,
} from "react-icons/fa";

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
    console.log("Home page mounted");
  }, []);

  // Log when selected patient changes
  useEffect(() => {
    if (selectedPatient) {
      console.log("Selected patient updated:", selectedPatient);
    }
  }, [selectedPatient]);

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
    console.log("Patient selected on home page:", patient);
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

  // Quick action buttons data
  const quickActions = [
    {
      title: "New Patient",
      description: "Register a new patient",
      icon: FaUserPlus,
      href: "/patients/new",
      color: "from-medical-primary to-medical-primary-dark",
      textColor: "text-medical-primary",
    },
    {
      title: "New Visit",
      description: "Schedule patient visit",
      icon: FaStethoscope,
      href: "/visits/new",
      color: "from-medical-secondary to-medical-secondary-dark",
      textColor: "text-medical-secondary",
    },
    {
      title: "Generate Bill",
      description: "Create patient bill",
      icon: FaClipboardList,
      href: "/bills/new",
      color: "from-medical-warning to-yellow-600",
      textColor: "text-medical-warning",
    },
    {
      title: "View Reports",
      description: "Access medical reports",
      icon: FaChartBar,
      href: "/reports",
      color: "from-purple-500 to-purple-600",
      textColor: "text-purple-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-medical-primary/10 via-medical-secondary/10 to-medical-primary/10 rounded-2xl p-8 border border-medical-primary/20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-4xl font-bold font-medical text-gradient-medical mb-2">
              Medical Center Dashboard
            </h1>
            <p className="text-medical-gray-medium text-lg">
              Comprehensive healthcare management at your fingertips
            </p>
            <div className="flex items-center space-x-4 mt-4 text-sm">
              <div className="flex items-center space-x-2 text-medical-secondary">
                <FaClock className="h-4 w-4" />
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
              {reportStats?.pendingReports &&
                reportStats.pendingReports > 0 && (
                  <div className="flex items-center space-x-2 text-medical-accent">
                    <FaExclamationTriangle className="h-4 w-4" />
                    <span>{reportStats.pendingReports} pending reports</span>
                  </div>
                )}
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="bg-white rounded-xl p-4 shadow-medical">
              <div className="text-center">
                <div className="text-2xl font-bold text-medical-primary">
                  {new Date().toLocaleDateString()}
                </div>
                <div className="text-sm text-medical-gray-medium">
                  {new Date().toLocaleDateString("en-US", { weekday: "long" })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Statistics Dashboard */}
      <Dashboard />
      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <Link
              key={index}
              href={action.href}
              className="group card-medical p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div
                  className={`bg-gradient-to-br ${action.color} rounded-xl p-4 shadow-lg group-hover:scale-110 transition-all duration-200`}
                >
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3
                    className={`font-semibold text-lg ${action.textColor} group-hover:text-medical-primary transition-colors duration-200`}
                  >
                    {action.title}
                  </h3>
                  <p className="text-medical-gray-medium text-sm mt-1">
                    {action.description}
                  </p>
                </div>
                <FaArrowRight className="h-4 w-4 text-medical-gray-medium group-hover:text-medical-primary group-hover:translate-x-1 transition-all duration-200" />
              </div>
            </Link>
          );
        })}
      </div>{" "}
      {/* Patient Lookup and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Patient Lookup Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-medical p-6">
            <h2 className="text-2xl font-semibold text-medical-gray-dark mb-6 flex items-center">
              <FaUserPlus className="mr-3 text-medical-primary" />
              Patient Lookup
            </h2>
            <PatientLookup onPatientSelect={handlePatientSelect} />
          </div>

          {selectedPatient && (
            <div className="card-medical p-6 border-l-4 border-medical-primary bg-gradient-to-r from-medical-primary/5 to-transparent">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
                <div>
                  <h3 className="text-xl font-semibold text-medical-gray-dark mb-2">
                    Selected Patient
                  </h3>
                  <div className="space-y-1">
                    <p className="text-lg font-medium text-medical-primary">
                      {selectedPatient.name}
                    </p>
                    <p className="text-medical-gray-medium">
                      📞 {selectedPatient.phoneNumber}
                    </p>
                    <p className="text-medical-gray-medium">
                      🆔 {selectedPatient.patientId}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col space-y-3 min-w-0 sm:min-w-[200px]">
                  <button
                    onClick={handleCreateVisit}
                    className="btn-medical-secondary flex items-center justify-center space-x-2"
                  >
                    <FaStethoscope className="h-4 w-4" />
                    <span>Create Visit</span>
                  </button>
                  <button
                    onClick={handleViewPatientHistory}
                    className="btn-medical-outline flex items-center justify-center space-x-2"
                  >
                    <FaChartBar className="h-4 w-4" />
                    <span>View History</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Recent Visits */}
          <div className="card-medical p-6">
            <h2 className="text-2xl font-semibold text-medical-gray-dark mb-6 flex items-center">
              <FaCalendarAlt className="mr-3 text-medical-secondary" />
              Recent Visits
            </h2>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="loading-spinner mx-auto mb-4"></div>
                <p className="text-medical-gray-medium">
                  Loading recent visits...
                </p>
              </div>
            ) : !recentVisits?.length ? (
              <div className="text-center py-12">
                <FaStethoscope className="h-16 w-16 text-medical-gray-medium/50 mx-auto mb-4" />
                <p className="text-medical-gray-medium text-lg">
                  No recent visits found.
                </p>
                <p className="text-medical-gray-medium text-sm">
                  Start by creating a new patient visit.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-medical-gray-light">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-medical-gray-dark uppercase tracking-wider">
                          Patient
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-medical-gray-dark uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-medical-gray-dark uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-medical-gray-dark uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentVisits.map((visit, index) => (
                        <tr
                          key={visit.visitId}
                          className="hover:bg-medical-gray-light/50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-medical-primary/10 flex items-center justify-center">
                                  <FaUserInjured className="h-5 w-5 text-medical-primary" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-medical-gray-dark">
                                  {visit.patientName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-medical-gray-dark">
                              {new Date(visit.visitDate).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-medical-gray-medium">
                              {new Date(visit.visitDate).toLocaleTimeString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-medical-secondary/10 text-medical-secondary">
                              Completed
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-3">
                            <Link
                              href={`/visits/${visit.visitId}`}
                              className="text-medical-primary hover:text-medical-primary-dark font-medium transition-colors duration-150"
                            >
                              View
                            </Link>
                            <Link
                              href={`/bills/new?visitId=${visit.visitId}`}
                              className="text-medical-secondary hover:text-medical-secondary-dark font-medium transition-colors duration-150"
                            >
                              Bill
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* System Status */}
          <div className="card-medical p-6">
            <h3 className="text-xl font-semibold text-medical-gray-dark mb-4 flex items-center">
              <FaChartBar className="mr-3 text-medical-info" />
              System Status
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-medical-gray-medium">Database</span>
                <span className="status-healthy px-2 py-1 rounded-full text-xs font-medium">
                  Connected
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-medical-gray-medium">Last Backup</span>
                <span className="text-medical-gray-dark font-medium">Auto</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-medical-gray-medium">Version</span>
                <span className="text-medical-gray-dark font-medium">
                  2.0.0
                </span>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <Link
                  href="/admin"
                  className="w-full btn-medical-outline flex items-center justify-center space-x-2"
                >
                  <FaCog className="h-4 w-4" />
                  <span>Admin Panel</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card-medical p-6">
            <h3 className="text-xl font-semibold text-medical-gray-dark mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-medical-gray-light/50">
                <div className="flex-shrink-0 w-2 h-2 bg-medical-primary rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-medical-gray-dark">
                    New patient registered
                  </p>
                  <p className="text-xs text-medical-gray-medium">
                    2 minutes ago
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-medical-gray-light/50">
                <div className="flex-shrink-0 w-2 h-2 bg-medical-secondary rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-medical-gray-dark">
                    Visit completed
                  </p>
                  <p className="text-xs text-medical-gray-medium">
                    15 minutes ago
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-medical-gray-light/50">
                <div className="flex-shrink-0 w-2 h-2 bg-medical-warning rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-medical-gray-dark">
                    Bill generated
                  </p>
                  <p className="text-xs text-medical-gray-medium">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
