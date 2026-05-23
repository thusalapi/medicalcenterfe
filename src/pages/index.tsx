import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useQuery } from "react-query";
import { visitAPI, reportAPI, billAPI } from "../utils/api";
import { formatDateShort } from "../utils/date";
import PatientLookup from "../components/patients/PatientLookup";
import Dashboard from "../components/dashboard/Dashboard";
import { Patient, Visit } from "../types";
import {
  FaUserPlus,
  FaStethoscope,
  FaClipboardList,
  FaChartBar,
  FaCalendarAlt,
  FaFileAlt,
  FaDollarSign,
  FaUser,
  FaClock,
} from "react-icons/fa";

export default function Home() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  const { data: recentVisits, isLoading } = useQuery<Visit[], Error>(
    "recentVisits",
    () => visitAPI.getRecentVisits(8),
    { refetchInterval: 30000, enabled: isMounted }
  );

  const handlePatientSelect = (patient: Patient) => {
    router.push(`/visits/new?patientId=${patient.patientId}`);
  };

  const quickActions = [
    { title: "New Patient", icon: FaUserPlus, href: "/patients/new", color: "bg-blue-500" },
    { title: "New Visit", icon: FaStethoscope, href: "/visits/new", color: "bg-green-500" },
    { title: "New Bill", icon: FaClipboardList, href: "/bills/new", color: "bg-amber-500" },
    { title: "Reports", icon: FaChartBar, href: "/reports", color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className={`${a.color} text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:opacity-90 transition-opacity`}
            >
              <a.icon className="h-4 w-4" />
              {a.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <Dashboard />

      {/* Main content: lookup + recent visits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient lookup — selecting a patient goes straight to New Visit */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-1">Patient Lookup</h2>
          <p className="text-sm text-gray-500 mb-4">Search by phone number — selecting a patient starts a new visit.</p>
          <PatientLookup onPatientSelect={handlePatientSelect} />
          <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
            <Link href="/patients/new" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              <FaUserPlus className="h-3.5 w-3.5" /> Register new patient
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/patients" className="text-sm text-gray-500 hover:underline">
              Browse all patients
            </Link>
          </div>
        </div>

        {/* Recent visits */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <FaCalendarAlt className="h-4 w-4 text-gray-400" /> Recent Visits
            </h2>
            <Link href="/visits" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>

          {isLoading ? (
            <div className="py-8 text-center text-gray-400 text-sm">Loading…</div>
          ) : !recentVisits?.length ? (
            <div className="py-8 text-center text-gray-400 text-sm">No visits yet.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentVisits.map((visit) => (
                <div key={visit.visitId} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <FaUser className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{visit.patientName}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <FaClock className="h-3 w-3" />
                        {formatDateShort(visit.visitDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                    <Link href={`/reports/new?visitId=${visit.visitId}`} className="text-xs text-green-600 hover:underline flex items-center gap-1">
                      <FaFileAlt className="h-3.5 w-3.5" /> Report
                    </Link>
                    <Link href={`/bills/new?visitId=${visit.visitId}`} className="text-xs text-amber-600 hover:underline flex items-center gap-1">
                      <FaDollarSign className="h-3.5 w-3.5" /> Bill
                    </Link>
                    <Link href={`/visits/${visit.visitId}`} className="text-xs text-gray-400 hover:text-gray-600 hover:underline">
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
