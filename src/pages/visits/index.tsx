import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import Link from "next/link";
import Head from "next/head";
import { visitAPI } from "../../utils/api";
import { Visit } from "../../types";
import {
  FaSearch, FaPlus, FaUser, FaFileAlt, FaDollarSign,
  FaEye, FaChevronLeft, FaChevronRight, FaClock,
} from "react-icons/fa";

export default function VisitsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(searchTerm); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const { data: response, isLoading, error } = useQuery(
    ["allVisits", debouncedSearch, page, dateFilter],
    () => visitAPI.getAllVisits(debouncedSearch || undefined, dateFilter || undefined, undefined, page, perPage),
    { keepPreviousData: true, staleTime: 5 * 60 * 1000 }
  );

  const visits: Visit[] = response?.visits || response || [];
  const total: number = response?.total ?? visits.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <>
      <Head><title>Visits | Medical Center</title></Head>

      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Visits</h1>
            {total > 0 && <p className="text-sm text-gray-400 mt-0.5">{total} total</p>}
          </div>
          <Link
            href="/visits/new"
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-green-700"
          >
            <FaPlus className="h-3.5 w-3.5" /> New Visit
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by patient name or visit ID…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => { setDateFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {(debouncedSearch || dateFilter) && (
            <button
              onClick={() => { setSearchTerm(""); setDebouncedSearch(""); setDateFilter(""); setPage(1); }}
              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Clear
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="py-16 text-center text-gray-400 text-sm">Loading…</div>
          ) : error ? (
            <div className="py-16 text-center text-sm text-red-500">Failed to load visits.</div>
          ) : !visits.length ? (
            <div className="py-16 text-center">
              <p className="text-gray-400 text-sm">
                {debouncedSearch || dateFilter ? "No visits match your filters." : "No visits yet."}
              </p>
              {!debouncedSearch && !dateFilter && (
                <Link href="/visits/new" className="mt-2 inline-block text-sm text-blue-600 hover:underline">
                  Create first visit
                </Link>
              )}
            </div>
          ) : (
            <>
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-5 py-3">Patient</th>
                    <th className="px-5 py-3 hidden sm:table-cell">Date & Time</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {visits.map((visit) => (
                    <tr key={visit.visitId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                            <FaUser className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{visit.patientName}</p>
                            <p className="text-xs text-gray-400 sm:hidden flex items-center gap-1 mt-0.5">
                              <FaClock className="h-3 w-3" />
                              {new Date(visit.visitDate).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                            </p>
                            <p className="text-xs text-gray-400">#{visit.visitId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 hidden sm:table-cell">
                        <span className="text-sm text-gray-600 flex items-center gap-1.5">
                          <FaClock className="h-3.5 w-3.5 text-gray-400" />
                          {new Date(visit.visitDate).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/reports/new?visitId=${visit.visitId}`}
                            className="text-xs text-green-600 hover:underline flex items-center gap-1 font-medium"
                          >
                            <FaFileAlt className="h-3.5 w-3.5" /> Report
                          </Link>
                          <Link
                            href={`/bills/new?visitId=${visit.visitId}`}
                            className="text-xs text-amber-600 hover:underline flex items-center gap-1 font-medium"
                          >
                            <FaDollarSign className="h-3.5 w-3.5" /> Bill
                          </Link>
                          <Link
                            href={`/visits/${visit.visitId}`}
                            className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
                          >
                            <FaEye className="h-3.5 w-3.5" /> View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                  <p className="text-xs text-gray-500">Page {page} of {totalPages}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <FaChevronLeft className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <FaChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
