import React, { useState } from "react";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { patientAPI } from "../../utils/api";
import { Patient } from "../../types";
import {
  FaSearch,
  FaPlus,
  FaUser,
  FaPhone,
  FaEye,
  FaEdit,
  FaSpinner,
  FaExclamationTriangle,
  FaUserFriends,
} from "react-icons/fa";

const PatientsPage: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const limit = 10;

  // Fetch patients with search and pagination
  const {
    data: patients,
    isLoading,
    error,
    refetch,
  } = useQuery(
    ["patients", searchQuery, currentPage],
    () => patientAPI.getAllPatients(searchQuery, currentPage, limit),
    {
      keepPreviousData: true,
      onError: (err) => {
        console.error("Failed to fetch patients:", err);
      },
    }
  );

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchTerm);
    setCurrentPage(1);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  // Navigate to patient details
  const handleViewPatient = (patientId: number) => {
    router.push(`/patients/${patientId}`);
  };

  // Navigate to edit patient
  const handleEditPatient = (patientId: number) => {
    router.push(`/patients/${patientId}?edit=true`);
  };

  return (
    <>
      <Head>
        <title>Patients | Medical Center Management System</title>
        <meta name="description" content="View and manage patient records" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FaUserFriends className="mr-3 text-blue-600" />
              Patients
            </h1>
            <p className="text-gray-600 mt-1">
              Manage patient records and information
            </p>
          </div>
          <Link
            href="/patients/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <FaPlus className="mr-2 h-4 w-4" />
            Add New Patient
          </Link>
        </div>

        {/* Search Bar */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search patients by name or phone number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <FaSpinner className="animate-spin h-4 w-4 mr-2" />
                ) : (
                  <FaSearch className="h-4 w-4 mr-2" />
                )}
                Search
              </button>
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Clear
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
            <div className="flex items-center">
              <FaExclamationTriangle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-800">
                Failed to load patients. Please try again.
              </p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !patients && (
          <div className="bg-white shadow rounded-lg p-8">
            <div className="flex flex-col items-center justify-center py-12">
              <FaSpinner className="animate-spin h-8 w-8 text-blue-600 mb-4" />
              <p className="text-gray-600">Loading patients...</p>
            </div>
          </div>
        )}

        {/* Patients List */}
        {patients && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {patients.length === 0 ? (
              <div className="text-center py-12">
                <FaUser className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? "No patients found" : "No patients yet"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery
                    ? `No patients match "${searchQuery}". Try a different search term.`
                    : "Get started by registering your first patient."}
                </p>
                {!searchQuery && (
                  <Link
                    href="/patients/new"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <FaPlus className="mr-2 h-4 w-4" />
                    Add First Patient
                  </Link>
                )}
              </div>
            ) : (
              <>
                {/* Table Header */}
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="font-medium text-gray-700">Patient Info</div>
                    <div className="font-medium text-gray-700 hidden md:block">
                      Phone Number
                    </div>
                    <div className="font-medium text-gray-700 hidden md:block">
                      Patient ID
                    </div>
                    <div className="font-medium text-gray-700">Actions</div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-200">
                  {patients.map((patient: Patient) => (
                    <div
                      key={patient.patientId}
                      className="px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        {/* Patient Info */}
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <FaUser className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {patient.name}
                            </p>
                            <p className="text-sm text-gray-500 md:hidden">
                              <FaPhone className="inline h-3 w-3 mr-1" />
                              {patient.phoneNumber}
                            </p>
                          </div>
                        </div>

                        {/* Phone Number - Hidden on mobile */}
                        <div className="text-sm text-gray-900 hidden md:block">
                          <FaPhone className="inline h-3 w-3 mr-2 text-gray-400" />
                          {patient.phoneNumber}
                        </div>

                        {/* Patient ID - Hidden on mobile */}
                        <div className="text-sm text-gray-500 hidden md:block">
                          #{patient.patientId}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewPatient(patient.patientId)}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <FaEye className="h-3 w-3 mr-1" />
                            View
                          </button>
                          <button
                            onClick={() => handleEditPatient(patient.patientId)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <FaEdit className="h-3 w-3 mr-1" />
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {patients.length === limit && (
                  <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 flex justify-between sm:hidden">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={patients.length < limit}
                          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            Showing page{" "}
                            <span className="font-medium">{currentPage}</span>
                          </p>
                        </div>
                        <div>
                          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button
                              onClick={() =>
                                setCurrentPage(Math.max(1, currentPage - 1))
                              }
                              disabled={currentPage === 1}
                              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Previous
                            </button>
                            <button
                              onClick={() => setCurrentPage(currentPage + 1)}
                              disabled={patients.length < limit}
                              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Next
                            </button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Search Results Info */}
        {searchQuery && patients && patients.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Found {patients.length} patient{patients.length !== 1 ? "s" : ""} matching "{searchQuery}"
          </div>
        )}
      </div>
    </>
  );
};

export default PatientsPage;