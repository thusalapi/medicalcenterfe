import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  FaHome,
  FaUserInjured,
  FaStethoscope,
  FaFileAlt,
  FaMoneyBillWave,
  FaCog,
  FaBars,
  FaTimes,
  FaHeartbeat,
} from "react-icons/fa";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if the current route is active
  const isActive = (path: string) => {
    return router.pathname === path || router.pathname.startsWith(path);
  };

  const navigationItems = [
    { href: "/", label: "Dashboard", icon: FaHome },
    { href: "/patients", label: "Patients", icon: FaUserInjured },
    { href: "/visits", label: "Visits", icon: FaStethoscope },
    { href: "/reports", label: "Reports", icon: FaFileAlt },
    { href: "/bills", label: "Bills", icon: FaMoneyBillWave },
    { href: "/admin", label: "Admin", icon: FaCog },
  ];

  return (
    <div className="min-h-screen bg-medical-gray-light">
      <Head>
        <title>Medical Center Management System</title>
        <meta
          name="description"
          content="Comprehensive management system for medical center operations"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation Header */}
      <nav className="gradient-medical shadow-medical-lg relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex-shrink-0 flex items-center space-x-3">
              <div className="bg-white/20 rounded-full p-2">
                <FaHeartbeat className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl text-white font-medical">
                  Medical Center
                </span>
                <div className="text-white/80 text-xs font-medium">
                  Management System
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-2">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`nav-link ${
                        isActive(item.href)
                          ? "nav-link-active"
                          : "nav-link-inactive"
                      } flex items-center space-x-2`}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:bg-white/10 p-2 rounded-md transition-colors duration-200"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <FaTimes className="h-6 w-6" />
                ) : (
                  <FaBars className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-medical-navy/95 backdrop-blur-sm shadow-lg border-t border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`${
                      isActive(item.href)
                        ? "bg-white/20 text-white"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    } block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center space-x-3`}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}{" "}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 fade-in">
        <div className="slide-up">{children}</div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-auto py-6 border-t border-gray-200 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <FaHeartbeat className="h-5 w-5 text-medical-primary" />
              <span className="text-medical-gray-dark font-medium">
                Medical Center Management System
              </span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-medical-gray-medium">
              <span>&copy; {new Date().getFullYear()} All rights reserved</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">Version 2.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
