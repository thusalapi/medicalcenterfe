import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { useQuery } from "react-query";
import { patientAPI } from "../../utils/api";
import { Patient } from "../../types";
import { FaSearch, FaPlus, FaUser, FaPhone, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const PatientsPage: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Live debounced search
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(searchTerm); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const { data: patients, isLoading, error } = useQuery(
    ["patients", debouncedSearch, page],
    () => patientAPI.getAllPatients(debouncedSearch || undefined, page, limit),
    { keepPreviousData: true }
  );

  const hasMore = (patients?.length ?? 0) === limit;

  return (
    <>
      <Head><title>Patients | Medical Center</title></Head>

      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <Link
            href="/patients/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-700"
          >
            <FaPlus className="h-3.5 w-3.5" /> New Patient
          </Link>
        </div>

        {/* Search */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by name or phone number…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg border border-red-200">
            Failed to load patients. Please refresh.
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {!patients?.length && !isLoading ? (
            <div className="py-16 text-center">
              <FaUser className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                {debouncedSearch ? `No patients match "${debouncedSearch}"` : "No patients yet."}
              </p>
              {!debouncedSearch && (
                <Link href="/patients/new" className="mt-3 inline-block text-sm text-blue-600 hover:underline">
                  Register first patient
                </Link>
              )}
            </div>
          ) : (
            <>
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-5 py-3">Name</th>
                    <th className="px-5 py-3 hidden sm:table-cell">Phone</th>
                    <th className="px-5 py-3 hidden md:table-cell">ID</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {patients?.map((patient: Patient) => (
                    <tr
                      key={patient.patientId}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => router.push(`/patients/${patient.patientId}`)}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <FaUser className="h-4 w-4 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                            <p className="text-xs text-gray-400 sm:hidden">{patient.phoneNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 hidden sm:table-cell">
                        <span className="text-sm text-gray-600 flex items-center gap-1.5">
                          <FaPhone className="h-3 w-3 text-gray-400" /> {patient.phoneNumber}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <span className="text-xs text-gray-400">#{patient.patientId}</span>
                      </td>
                      <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <Link
                          href={`/visits/new?patientId=${patient.patientId}`}
                          className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-md hover:bg-green-100 font-medium mr-2"
                        >
                          New Visit
                        </Link>
                        <Link
                          href={`/patients/${patient.patientId}`}
                          className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                <p className="text-xs text-gray-500">Page {page}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <FaChevronLeft className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={!hasMore}
                    className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <FaChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PatientsPage;
