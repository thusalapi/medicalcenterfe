import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();

  // Check if the current route is active
  const isActive = (path: string) => {
    return router.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Medical Center Management System</title>
        <meta
          name="description"
          content="Management system for medical center operations"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl">Medical Center</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/")
                      ? "bg-blue-700 text-white"
                      : "text-white hover:bg-blue-500"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/patients"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/patients")
                      ? "bg-blue-700 text-white"
                      : "text-white hover:bg-blue-500"
                  }`}
                >
                  Patients
                </Link>
                <Link
                  href="/visits"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/visits")
                      ? "bg-blue-700 text-white"
                      : "text-white hover:bg-blue-500"
                  }`}
                >
                  Visits
                </Link>
                <Link
                  href="/reports"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/reports")
                      ? "bg-blue-700 text-white"
                      : "text-white hover:bg-blue-500"
                  }`}
                >
                  Reports
                </Link>
                <Link
                  href="/bills"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/bills")
                      ? "bg-blue-700 text-white"
                      : "text-white hover:bg-blue-500"
                  }`}
                >
                  Bills
                </Link>
                <Link
                  href="/admin"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/admin")
                      ? "bg-blue-700 text-white"
                      : "text-white hover:bg-blue-500"
                  }`}
                >
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>

      <footer className="bg-white mt-auto py-4 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Medical Center Management System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
