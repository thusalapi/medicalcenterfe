import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import Link from "next/link";
import Head from "next/head";
import { billAPI } from "../../utils/api";
import { Bill } from "../../types";
import {
  FaSearch,
  FaPlus,
  FaDollarSign,
  FaUser,
  FaEye,
  FaDownload,
  FaSpinner,
  FaExclamationCircle,
  FaFileInvoiceDollar,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";

export default function BillsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const billsPerPage = 10;

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch bills from backend
  const {
    data: billsResponse,
    isLoading,
    error,
    refetch,
  } = useQuery(
    ["allBills", debouncedSearchTerm, currentPage, dateFilter, statusFilter],
    () =>
      billAPI.getAllBills(
        debouncedSearchTerm || undefined,
        dateFilter || undefined,
        undefined, // dateTo (we're using single date filter for now)
        statusFilter || undefined,
        currentPage,
        billsPerPage
      ),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const bills = billsResponse?.bills || [];
  const totalBills = billsResponse?.total || 0;
  const totalPages = Math.ceil(totalBills / billsPerPage);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleDownloadBill = async (billId: number) => {
    try {
      const blob = await billAPI.generateBillPdf(billId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Bill_${billId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error downloading bill:", err);
    }
  };

  return (
    <>
      <Head>
        <title>Bills | Medical Center Management System</title>
      </Head>

      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-medical-primary/10 via-medical-secondary/10 to-medical-primary/10 rounded-2xl p-6 border border-medical-primary/20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold font-medical text-gradient-medical mb-2">
                Billing Management
              </h1>
              <p className="text-medical-gray-medium">
                Manage and view all patient bills and payments
              </p>
              {totalBills > 0 && (
                <div className="flex items-center space-x-4 mt-2 text-sm">
                  <div className="flex items-center space-x-2 text-medical-secondary">
                    <FaFileInvoiceDollar className="h-4 w-4" />
                    <span>{totalBills} total bills</span>
                  </div>
                </div>
              )}
            </div>
            <Link
              href="/bills/new"
              className="btn-medical-primary flex items-center space-x-2"
            >
              <FaPlus className="h-4 w-4" />
              <span>Create Bill</span>
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
                placeholder="Search by patient name or bill ID..."
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
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-medical"
              >
                <option value="">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
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

        {/* Bills Table */}
        <div className="card-medical overflow-hidden">
          {isLoading ? (
            <div className="text-center py-12">
              <FaSpinner className="h-12 w-12 text-medical-primary animate-spin mx-auto mb-4" />
              <p className="text-medical-gray-medium">Loading bills...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <FaExclamationCircle className="h-12 w-12 text-medical-accent mx-auto mb-4" />
              <p className="text-medical-accent text-lg font-semibold mb-2">
                Error loading bills
              </p>
              <p className="text-medical-gray-medium mb-4">
                {(error as Error).message || "Something went wrong"}
              </p>
              <button onClick={() => refetch()} className="btn-medical-primary">
                Try Again
              </button>
            </div>
          ) : !bills.length ? (
            <div className="text-center py-12">
              <FaFileInvoiceDollar className="h-16 w-16 text-medical-gray-medium/50 mx-auto mb-4" />
              <p className="text-medical-gray-medium text-lg">
                {searchTerm || dateFilter || statusFilter
                  ? "No bills found"
                  : "No bills created yet"}
              </p>
              <p className="text-medical-gray-medium text-sm mb-4">
                {searchTerm || dateFilter || statusFilter
                  ? "Try adjusting your search criteria"
                  : "Start by creating your first bill"}
              </p>
              {!searchTerm && !dateFilter && !statusFilter && (
                <Link href="/bills/new" className="btn-medical-primary">
                  Create First Bill
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
                        Bill ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-medical-gray-dark uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-medical-gray-dark uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-medical-gray-dark uppercase tracking-wider">
                        Amount
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
                    {bills.map((bill) => (
                      <tr
                        key={bill.billId}
                        className="hover:bg-medical-gray-light/50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-medical-primary">
                            #{bill.billId}
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
                                {bill.patientName}
                              </div>
                              <div className="text-sm text-medical-gray-medium">
                                Visit: {bill.visitId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaCalendarAlt className="h-4 w-4 text-medical-gray-medium mr-2" />
                            <div className="text-sm text-medical-gray-dark">
                              {formatDate(bill.billDate)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-medical-gray-dark">
                            {formatCurrency(bill.totalAmount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              bill.status === "paid"
                                ? "bg-medical-secondary/10 text-medical-secondary"
                                : bill.status === "overdue"
                                ? "bg-medical-accent/10 text-medical-accent"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {bill.status
                              ? bill.status.charAt(0).toUpperCase() +
                                bill.status.slice(1)
                              : "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-3">
                          <Link
                            href={`/visits/${bill.visitId}`}
                            className="text-medical-primary hover:text-medical-primary-dark font-medium transition-colors duration-150 inline-flex items-center space-x-1"
                          >
                            <FaEye className="h-4 w-4" />
                            <span>View</span>
                          </Link>
                          <button
                            onClick={() => handleDownloadBill(bill.billId)}
                            className="text-medical-secondary hover:text-medical-secondary-dark font-medium transition-colors duration-150 inline-flex items-center space-x-1"
                          >
                            <FaDownload className="h-4 w-4" />
                            <span>PDF</span>
                          </button>
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
                      Showing {(currentPage - 1) * billsPerPage + 1} to{" "}
                      {Math.min(currentPage * billsPerPage, totalBills)} of{" "}
                      {totalBills} bills
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
