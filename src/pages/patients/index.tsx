import React, { useState } from "react";
import { useQuery } from "react-query";
import Link from "next/link";
import { patientAPI } from "../../utils/api";
import Head from "next/head";
import { Patient } from "../../types";

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 10;

  // In a real app, we would have a backend endpoint to search patients
  // This is a placeholder implementation using local filtering
  const {
    data: patients,
    isLoading,
    error,
  } = useQuery<Patient[]>("allPatients", async () => {
    // This would be replaced with an appropriate API call in a real implementation
    // For example: patientAPI.getAllPatients()

    // Mock data for demonstration
    return [
      {
        patientId: 1,
        name: "John Smith",
        phoneNumber: "0771234567",
        otherDetails: { age: 45, gender: "Male" },
      },
      {
        patientId: 2,
        name: "Mary Johnson",
        phoneNumber: "0771234568",
        otherDetails: { age: 32, gender: "Female" },
      },
      {
        patientId: 3,
        name: "David Brown",
        phoneNumber: "0771234569",
        otherDetails: { age: 28, gender: "Male" },
      },
      {
        patientId: 4,
        name: "Sarah Wilson",
        phoneNumber: "0771234570",
        otherDetails: { age: 54, gender: "Female" },
      },
      {
        patientId: 5,
        name: "Michael Lee",
        phoneNumber: "0771234571",
        otherDetails: { age: 41, gender: "Male" },
      },
      {
        patientId: 6,
        name: "Jennifer Garcia",
        phoneNumber: "0771234572",
        otherDetails: { age: 36, gender: "Female" },
      },
      {
        patientId: 7,
        name: "Robert Martinez",
        phoneNumber: "0771234573",
        otherDetails: { age: 63, gender: "Male" },
      },
      {
        patientId: 8,
        name: "Elizabeth Taylor",
        phoneNumber: "0771234574",
        otherDetails: { age: 29, gender: "Female" },
      },
      {
        patientId: 9,
        name: "William Anderson",
        phoneNumber: "0771234575",
        otherDetails: { age: 47, gender: "Male" },
      },
      {
        patientId: 10,
        name: "Linda Thomas",
        phoneNumber: "0771234576",
        otherDetails: { age: 52, gender: "Female" },
      },
      {
        patientId: 11,
        name: "Richard Jackson",
        phoneNumber: "0771234577",
        otherDetails: { age: 38, gender: "Male" },
      },
      {
        patientId: 12,
        name: "Patricia White",
        phoneNumber: "0771234578",
        otherDetails: { age: 44, gender: "Female" },
      },
    ];
  });

  // Filter patients based on search term
  const filteredPatients =
    patients?.filter(
      (patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phoneNumber.includes(searchTerm)
    ) || [];

  // Calculate pagination
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  // Handle pagination
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      <Head>
        <title>Patients | Medical Center Management System</title>
      </Head>

      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Patient Registry</h1>
          <Link
            href="/patients/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            New Patient
          </Link>
        </div>

        {/* Search */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by name or phone number..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
                }}
              />
            </div>
          </div>
        </div>

        {/* Patient List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-3 text-gray-600">Loading patients...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-red-500 mx-auto mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-lg text-red-500 font-medium">
                Failed to load patients
              </p>
              <p className="text-gray-600 mt-1">Please try again later</p>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-gray-400 mx-auto mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="text-lg font-medium">No patients found</p>
              <p className="text-gray-600 mt-1">
                Try adjusting your search or create a new patient
              </p>
              <Link
                href="/patients/new"
                className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Register New Patient
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Patient Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Phone Number
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Details
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
                    {currentPatients.map((patient) => (
                      <tr key={patient.patientId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {patient.patientId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {patient.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {patient.phoneNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {patient.otherDetails?.age && (
                            <span>Age: {patient.otherDetails.age}</span>
                          )}
                          {patient.otherDetails?.gender && (
                            <span className="ml-2">
                              Gender: {patient.otherDetails.gender}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <Link
                            href={`/patients/${patient.patientId}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            View
                          </Link>
                          <Link
                            href={`/visits/new?patientId=${patient.patientId}`}
                            className="text-green-600 hover:text-green-800"
                          >
                            New Visit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{" "}
                        <span className="font-medium">
                          {indexOfFirstPatient + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {Math.min(
                            indexOfLastPatient,
                            filteredPatients.length
                          )}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">
                          {filteredPatients.length}
                        </span>{" "}
                        patients
                      </p>
                    </div>
                    <div>
                      <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                      >
                        <button
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === 1
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          <span className="sr-only">Previous</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>

                        {Array.from({ length: totalPages }).map((_, index) => (
                          <button
                            key={index}
                            onClick={() => paginate(index + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                              currentPage === index + 1
                                ? "bg-blue-50 border-blue-500 text-blue-600 z-10"
                                : "bg-white text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {index + 1}
                          </button>
                        ))}

                        <button
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === totalPages
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          <span className="sr-only">Next</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </nav>
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
