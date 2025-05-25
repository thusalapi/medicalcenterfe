import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import Link from "next/link";
import Head from "next/head";
import { visitAPI } from "../../utils/api";
import { Visit } from "../../types";
import {
  FaSearch,
  FaPlus,
  FaCalendarAlt,
  FaUser,
  FaEye,
  FaFileAlt,
  FaDollarSign,
  FaSpinner,
  FaExclamationCircle,
  FaUserFriends,
  FaClock,
} from "react-icons/fa";

export default function VisitsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState("");
  const visitsPerPage = 10;

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch visits from backend
  const {
    data: visitsResponse,
    isLoading,
    error,
    refetch,
  } = useQuery(
    ["allVisits", debouncedSearchTerm, currentPage, dateFilter],
    () =>
      visitAPI.getAllVisits(
        debouncedSearchTerm || undefined,
        dateFilter || undefined,
        undefined, // dateTo (we're using single date filter for now)
        currentPage,
        visitsPerPage
      ),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const visits = visitsResponse?.visits || [];
  const totalVisits = visitsResponse?.total || 0;
  const totalPages = Math.ceil(totalVisits / visitsPerPage);

  // Handle pagination
  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      const end = Math.min(totalPages, start + maxVisible - 1);

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Head>
        <title>Visits | Medical Center Management System</title>
      </Head>

      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-medical-primary/10 via-medical-secondary/10 to-medical-primary/10 rounded-2xl p-6 border border-medical-primary/20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold font-medical text-gradient-medical mb-2">
                Patient Visits
              </h1>
              <p className="text-medical-gray-medium">
                Manage and view all patient visits
              </p>
              {totalVisits > 0 && (
                <div className="flex items-center space-x-4 mt-2 text-sm">
                  <div className="flex items-center space-x-2 text-medical-secondary">
                    <FaUserFriends className="h-4 w-4" />
                    <span>{totalVisits} total visits</span>
                  </div>
                </div>
              )}
            </div>
            <Link
              href="/visits/new"
              className="btn-medical-primary flex items-center space-x-2"
            >
              <FaPlus className="h-4 w-4" />
              <span>New Visit</span>
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card-medical p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medical-gray-medium h-4 w-4" />
              <input
                type="text"
                placeholder="Search by patient name or visit ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-medical pl-10 w-full"
              />
            </div>
            <div className="flex space-x-4">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="input-medical"
                placeholder="Filter by date"
              />
              <button
                onClick={() => refetch()}
                className="btn-medical-outline flex items-center space-x-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <FaSpinner className="h-4 w-4 animate-spin" />
                ) : (
                  <FaSearch className="h-4 w-4" />
                )}
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Visits Table */}
        <div className="card-medical overflow-hidden">
          {isLoading ? (
            <div className="text-center py-12">
              <FaSpinner className="h-12 w-12 text-medical-primary animate-spin mx-auto mb-4" />
              <p className="text-medical-gray-medium">Loading visits...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <FaExclamationCircle className="h-12 w-12 text-medical-accent mx-auto mb-4" />
              <p className="text-medical-accent text-lg font-semibold mb-2">
                Error loading visits
              </p>
              <p className="text-medical-gray-medium mb-4">
                {(error as Error).message || "Something went wrong"}
              </p>
              <button onClick={() => refetch()} className="btn-medical-primary">
                Try Again
              </button>
            </div>
          ) : !visits.length ? (
            <div className="text-center py-12">
              <FaCalendarAlt className="h-16 w-16 text-medical-gray-medium/50 mx-auto mb-4" />
              <p className="text-medical-gray-medium text-lg">
                {searchTerm || dateFilter
                  ? "No visits found"
                  : "No visits recorded yet"}
              </p>
              <p className="text-medical-gray-medium text-sm mb-4">
                {searchTerm || dateFilter
                  ? "Try adjusting your search criteria"
                  : "Start by creating your first visit"}
              </p>
              {!searchTerm && !dateFilter && (
                <Link href="/visits/new" className="btn-medical-primary">
                  Create First Visit
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-medical-gray-light">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-medical-gray-dark uppercase tracking-wider">
                        Visit ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-medical-gray-dark uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-medical-gray-dark uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-medical-gray-dark uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-medical-gray-dark uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {visits.map((visit) => (
                      <tr
                        key={visit.visitId}
                        className="hover:bg-medical-gray-light/50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-medical-primary">
                            #{visit.visitId}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-medical-primary/10 flex items-center justify-center">
                                <FaUser className="h-5 w-5 text-medical-primary" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-medical-gray-dark">
                                {visit.patientName}
                              </div>
                              <div className="text-sm text-medical-gray-medium">
                                ID: {visit.patientId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaClock className="h-4 w-4 text-medical-gray-medium mr-2" />
                            <div>
                              <div className="text-sm font-medium text-medical-gray-dark">
                                {new Date(visit.visitDate).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-medical-gray-medium">
                                {formatTime(visit.visitDate)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-medical-secondary/10 text-medical-secondary">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-3">
                          <Link
                            href={`/visits/${visit.visitId}`}
                            className="text-medical-primary hover:text-medical-primary-dark font-medium transition-colors duration-150 inline-flex items-center space-x-1"
                          >
                            <FaEye className="h-4 w-4" />
                            <span>View</span>
                          </Link>
                          <Link
                            href={`/reports/new?visitId=${visit.visitId}`}
                            className="text-medical-secondary hover:text-medical-secondary-dark font-medium transition-colors duration-150 inline-flex items-center space-x-1"
                          >
                            <FaFileAlt className="h-4 w-4" />
                            <span>Report</span>
                          </Link>
                          <Link
                            href={`/bills/new?visitId=${visit.visitId}`}
                            className="text-medical-accent hover:text-medical-accent-dark font-medium transition-colors duration-150 inline-flex items-center space-x-1"
                          >
                            <FaDollarSign className="h-4 w-4" />
                            <span>Bill</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-medical-gray-light/30 px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-medical-gray-medium">
                      Showing {(currentPage - 1) * visitsPerPage + 1} to{" "}
                      {Math.min(currentPage * visitsPerPage, totalVisits)} of{" "}
                      {totalVisits} visits
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 rounded-md text-sm font-medium text-medical-gray-medium hover:text-medical-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                      >
                        Previous
                      </button>

                      {getPageNumbers().map((pageNumber) => (
                        <button
                          key={pageNumber}
                          onClick={() => goToPage(pageNumber)}
                          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                            currentPage === pageNumber
                              ? "bg-medical-primary text-white"
                              : "text-medical-gray-medium hover:text-medical-primary"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      ))}

                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 rounded-md text-sm font-medium text-medical-gray-medium hover:text-medical-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                      >
                        Next
                      </button>
                    </div>
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
