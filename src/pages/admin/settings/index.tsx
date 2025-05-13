import React, { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";

export default function SystemSettingsPage() {
  // Mock settings data - in a real app would come from an API
  const [settings, setSettings] = useState({
    general: {
      clinicName: "Medical Center",
      address: "123 Health Street, Colombo 07",
      phone: "+94 11 234 5678",
      email: "info@medicalcenter.lk",
      website: "www.medicalcenter.lk",
      logoUrl: "/logo.png",
    },
    security: {
      loginSessionTimeout: 30,
      passwordExpiry: 90,
      passwordMinLength: 8,
      requireSpecialChars: true,
      maxLoginAttempts: 5,
      twoFactorAuth: false,
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      appointmentReminders: true,
      reminderTimeHours: 24,
      reportReadyNotifications: true,
      systemUpdates: true,
    },
    backup: {
      autoDailyBackup: true,
      backupTime: "02:00",
      retainBackupDays: 30,
      backupLocation: "local",
      cloudBackup: false,
      cloudProvider: "none",
    },
    printing: {
      defaultPaperSize: "A4",
      headerFooter: true,
      printLogo: true,
      defaultPrinter: "Office Printer",
      pdfCompression: "medium",
    },
  });  const [activeTab, setActiveTab] = useState("general");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({ ...settings.general });
  
  // Update form data when active tab changes
  useEffect(() => {
    setFormData({ ...settings[activeTab as keyof typeof settings] });
  }, [activeTab, settings]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Update form data when tab changes
  useEffect(() => {
    setFormData({ ...settings[activeTab] });
    setIsEditing(false);
    setSaveSuccess(false);
  }, [activeTab, settings]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);

    // In a real app, this would be an API call
    setTimeout(() => {
      setSettings({
        ...settings,
        [activeTab]: { ...formData },
      });

      setIsEditing(false);
      setIsSaving(false);
      setSaveSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 800);
  };

  // Database backup function
  const handleBackupNow = () => {
    // This would trigger an API call in a real app
    alert("Database backup started. This may take a few minutes.");
  };

  // System check function
  const handleSystemCheck = () => {
    // This would trigger an actual system check in a real app
    alert("System check completed. All systems operating normally.");
  };

  return (
    <>
      <Head>
        <title>System Settings | Medical Center Management System</title>
      </Head>

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700">
                  Dashboard
                </Link>
              </li>
              <li>
                <span className="text-gray-400 mx-1">/</span>
                <Link
                  href="/admin"
                  className="text-gray-500 hover:text-gray-700"
                >
                  Admin
                </Link>
              </li>
              <li>
                <span className="text-gray-400 mx-1">/</span>
                <span className="text-gray-900">System Settings</span>
              </li>
            </ol>
          </nav>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              System Settings
            </h1>
            <p className="text-gray-600 mt-1">
              Configure system preferences and options
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="md:col-span-1">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-800">Settings</h2>
              </div>
              <nav className="p-2">
                <button
                  onClick={() => setActiveTab("general")}
                  className={`w-full text-left px-4 py-2 rounded-md text-sm ${
                    activeTab === "general"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  General Information
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full text-left px-4 py-2 rounded-md text-sm ${
                    activeTab === "security"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Security Settings
                </button>
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`w-full text-left px-4 py-2 rounded-md text-sm ${
                    activeTab === "notifications"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Notifications
                </button>
                <button
                  onClick={() => setActiveTab("backup")}
                  className={`w-full text-left px-4 py-2 rounded-md text-sm ${
                    activeTab === "backup"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Backup & Recovery
                </button>
                <button
                  onClick={() => setActiveTab("printing")}
                  className={`w-full text-left px-4 py-2 rounded-md text-sm ${
                    activeTab === "printing"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Printing & Reports
                </button>
              </nav>

              {/* System Actions */}
              <div className="p-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  System Actions
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={handleBackupNow}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"
                      />
                    </svg>
                    Backup Now
                  </button>
                  <button
                    onClick={handleSystemCheck}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    System Check
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className="md:col-span-3">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-medium text-gray-800">
                  {activeTab === "general" && "General Information"}
                  {activeTab === "security" && "Security Settings"}
                  {activeTab === "notifications" && "Notification Settings"}
                  {activeTab === "backup" && "Backup & Recovery"}
                  {activeTab === "printing" && "Printing & Reports"}
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </button>
                ) : (
                  <div className="space-x-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {saveSuccess && (
                <div className="p-4 bg-green-50 border-b border-green-100">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-green-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        Settings saved successfully.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-6">
                <form onSubmit={handleSubmit}>
                  {/* General Tab */}
                  {activeTab === "general" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="clinicName"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Clinic Name
                          </label>
                          <input
                            type="text"
                            name="clinicName"
                            id="clinicName"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={formData.clinicName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Phone Number
                          </label>
                          <input
                            type="text"
                            name="phone"
                            id="phone"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label
                            htmlFor="address"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Address
                          </label>
                          <input
                            type="text"
                            name="address"
                            id="address"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={formData.address}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="website"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Website
                          </label>
                          <input
                            type="text"
                            name="website"
                            id="website"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={formData.website}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Security Tab */}
                  {activeTab === "security" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="loginSessionTimeout"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Session Timeout (minutes)
                          </label>
                          <input
                            type="number"
                            name="loginSessionTimeout"
                            id="loginSessionTimeout"
                            min="1"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={formData.loginSessionTimeout}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="passwordExpiry"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Password Expiry (days)
                          </label>
                          <input
                            type="number"
                            name="passwordExpiry"
                            id="passwordExpiry"
                            min="0"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={formData.passwordExpiry}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                          <p className="mt-1 text-sm text-gray-500">
                            Set to 0 for no expiry
                          </p>
                        </div>
                        <div>
                          <label
                            htmlFor="passwordMinLength"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Min Password Length
                          </label>
                          <input
                            type="number"
                            name="passwordMinLength"
                            id="passwordMinLength"
                            min="6"
                            max="16"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={formData.passwordMinLength}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="maxLoginAttempts"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Max Login Attempts
                          </label>
                          <input
                            type="number"
                            name="maxLoginAttempts"
                            id="maxLoginAttempts"
                            min="1"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={formData.maxLoginAttempts}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="requireSpecialChars"
                            id="requireSpecialChars"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={formData.requireSpecialChars}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                          <label
                            htmlFor="requireSpecialChars"
                            className="ml-2 block text-sm text-gray-900"
                          >
                            Require Special Characters in Password
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="twoFactorAuth"
                            id="twoFactorAuth"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={formData.twoFactorAuth}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                          <label
                            htmlFor="twoFactorAuth"
                            className="ml-2 block text-sm text-gray-900"
                          >
                            Enable Two-Factor Authentication
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notifications Tab */}
                  {activeTab === "notifications" && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="emailNotifications"
                            id="emailNotifications"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={formData.emailNotifications}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                          <label
                            htmlFor="emailNotifications"
                            className="ml-2 block text-sm text-gray-900"
                          >
                            Enable Email Notifications
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="smsNotifications"
                            id="smsNotifications"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={formData.smsNotifications}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                          <label
                            htmlFor="smsNotifications"
                            className="ml-2 block text-sm text-gray-900"
                          >
                            Enable SMS Notifications
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="appointmentReminders"
                            id="appointmentReminders"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={formData.appointmentReminders}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                          <label
                            htmlFor="appointmentReminders"
                            className="ml-2 block text-sm text-gray-900"
                          >
                            Send Appointment Reminders
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="reminderTimeHours"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Reminder Time (hours before appointment)
                          </label>
                          <input
                            type="number"
                            name="reminderTimeHours"
                            id="reminderTimeHours"
                            min="1"
                            max="72"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={formData.reminderTimeHours}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="reportReadyNotifications"
                            id="reportReadyNotifications"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={formData.reportReadyNotifications}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                          <label
                            htmlFor="reportReadyNotifications"
                            className="ml-2 block text-sm text-gray-900"
                          >
                            Send Notification When Report is Ready
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="systemUpdates"
                            id="systemUpdates"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={formData.systemUpdates}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                          <label
                            htmlFor="systemUpdates"
                            className="ml-2 block text-sm text-gray-900"
                          >
                            Receive System Update Notifications
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Backup Tab */}
                  {activeTab === "backup" && (
                    <div className="space-y-6">
                      <div className="flex items-center mb-4">
                        <input
                          type="checkbox"
                          name="autoDailyBackup"
                          id="autoDailyBackup"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={formData.autoDailyBackup}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                        <label
                          htmlFor="autoDailyBackup"
                          className="ml-2 block text-sm text-gray-900"
                        >
                          Enable Automatic Daily Backup
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="backupTime"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Backup Time
                          </label>
                          <input
                            type="time"
                            name="backupTime"
                            id="backupTime"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={formData.backupTime}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="retainBackupDays"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Retain Backups (days)
                          </label>
                          <input
                            type="number"
                            name="retainBackupDays"
                            id="retainBackupDays"
                            min="1"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={formData.retainBackupDays}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="backupLocation"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Backup Location
                          </label>
                          <select
                            name="backupLocation"
                            id="backupLocation"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={formData.backupLocation}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          >
                            <option value="local">Local Storage</option>
                            <option value="network">Network Drive</option>
                            <option value="cloud">Cloud Storage</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="cloudBackup"
                          id="cloudBackup"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={formData.cloudBackup}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                        <label
                          htmlFor="cloudBackup"
                          className="ml-2 block text-sm text-gray-900"
                        >
                          Enable Cloud Backup
                        </label>
                      </div>

                      {formData.cloudBackup && (
                        <div>
                          <label
                            htmlFor="cloudProvider"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Cloud Provider
                          </label>
                          <select
                            name="cloudProvider"
                            id="cloudProvider"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={formData.cloudProvider}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          >
                            <option value="none">Select a provider</option>
                            <option value="aws">Amazon S3</option>
                            <option value="google">Google Cloud Storage</option>
                            <option value="azure">Microsoft Azure</option>
                            <option value="dropbox">Dropbox</option>
                          </select>
                        </div>
                      )}

                      {/* Backup History Section */}
                      <div className="mt-8">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">
                          Backup History
                        </h3>
                        <div className="border border-gray-200 rounded-md">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Date & Time
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Size
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  2023-08-12 02:00:03
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  128.5 MB
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Success
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  2023-08-11 02:00:11
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  127.8 MB
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Success
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  2023-08-10 02:00:07
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  127.2 MB
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Success
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Printing Tab */}
                  {activeTab === "printing" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="defaultPaperSize"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Default Paper Size
                          </label>
                          <select
                            name="defaultPaperSize"
                            id="defaultPaperSize"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={formData.defaultPaperSize}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          >
                            <option value="A4">A4</option>
                            <option value="Letter">Letter</option>
                            <option value="Legal">Legal</option>
                          </select>
                        </div>
                        <div>
                          <label
                            htmlFor="defaultPrinter"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Default Printer
                          </label>
                          <input
                            type="text"
                            name="defaultPrinter"
                            id="defaultPrinter"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={formData.defaultPrinter}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="pdfCompression"
                            className="block text-sm font-medium text-gray-700"
                          >
                            PDF Compression
                          </label>
                          <select
                            name="pdfCompression"
                            id="pdfCompression"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={formData.pdfCompression}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          >
                            <option value="low">Low (Higher Quality)</option>
                            <option value="medium">Medium</option>
                            <option value="high">
                              High (Smaller File Size)
                            </option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="headerFooter"
                            id="headerFooter"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={formData.headerFooter}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                          <label
                            htmlFor="headerFooter"
                            className="ml-2 block text-sm text-gray-900"
                          >
                            Include Header & Footer on Reports
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="printLogo"
                            id="printLogo"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={formData.printLogo}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                          <label
                            htmlFor="printLogo"
                            className="ml-2 block text-sm text-gray-900"
                          >
                            Include Clinic Logo on Reports
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Save Button */}
                  {isEditing && (
                    <div className="mt-6 flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Saving...
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
