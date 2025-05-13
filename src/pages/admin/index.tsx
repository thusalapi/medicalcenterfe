import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

export default function AdminPage() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Admin Dashboard | Medical Center Management System</title>
      </Head>

      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage system settings and configurations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* System Management Section */}
          <div className="col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Report Templates */}
              <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition duration-200">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-purple-100 mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Report Templates
                  </h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Create, edit, and manage medical report templates used
                  throughout the system.
                </p>
                <div className="pt-2">
                  <Link
                    href="/admin/report-templates"
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                  >
                    Manage Templates
                  </Link>
                </div>
              </div>

              {/* User Management */}
              <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition duration-200">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-blue-100 mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    User Management
                  </h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Add, edit, and manage staff accounts, access permissions, and
                  roles.
                </p>
                <div className="pt-2">
                  <Link
                    href="/admin/users"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Manage Users
                  </Link>
                </div>
              </div>

              {/* Billing Configuration */}
              <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition duration-200">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-green-100 mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Billing Settings
                  </h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Configure billing options, tax settings, and common fee
                  structures.
                </p>
                <div className="pt-2">
                  <Link
                    href="/admin/billing"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                  >
                    Manage Billing
                  </Link>
                </div>
              </div>

              {/* System Settings */}
              <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition duration-200">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-gray-100 mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    System Settings
                  </h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Configure general system settings, backup options, and clinic
                  information.
                </p>
                <div className="pt-2">
                  <Link
                    href="/admin/settings"
                    className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                  >
                    Manage Settings
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* System Status & Quick Actions */}
          <div className="space-y-6">
            {/* System Status */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                System Status
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Status</span>
                  <span className="font-medium text-green-600 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Database</span>
                  <span className="font-medium text-green-600">Connected</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Last Backup</span>
                  <span className="font-medium">Today, 02:00 AM</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Version</span>
                  <span className="font-medium">1.0.0</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 flex items-center justify-center transition">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Backup Database
                </button>
                <button className="w-full px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 flex items-center justify-center transition">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Generate Reports
                </button>
                <button className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 flex items-center justify-center transition">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Clear Cache
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
