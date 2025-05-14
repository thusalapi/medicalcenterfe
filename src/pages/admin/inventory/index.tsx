import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Link from "next/link";
import Head from "next/head";
import { medicineAPI } from "../../../utils/api";
import { Medicine } from "../../../types";
import InventoryStatistics from "../../../components/inventory/InventoryStatistics";
import MedicineCard from "../../../components/inventory/MedicineCard";

const InventoryPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "low-stock" | "expiring">(
    "all"
  );
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Fetch all medicines
  const { data: allMedicines, isLoading: isLoadingAll } = useQuery<Medicine[]>(
    "allMedicines",
    medicineAPI.getAllMedicines,
    {
      onError: () => {
        setError("Failed to load medicines. Please try again later.");
      },
    }
  );

  // Fetch low stock medicines
  const { data: lowStockMedicines, isLoading: isLoadingLowStock } = useQuery<
    Medicine[]
  >("lowStockMedicines", medicineAPI.getLowStockMedicines, {
    onError: () => {
      setError("Failed to load low stock medicines. Please try again later.");
    },
  });

  // Fetch expiring medicines
  const { data: expiringMedicines, isLoading: isLoadingExpiring } = useQuery<
    Medicine[]
  >("expiringMedicines", () => medicineAPI.getExpiringMedicines(30), {
    onError: () => {
      setError("Failed to load expiring medicines. Please try again later.");
    },
  });

  // Delete medicine mutation
  const deleteMedicine = useMutation(
    (id: number) => medicineAPI.deleteMedicine(id),
    {
      onSuccess: () => {
        // Invalidate and refetch the medicines query
        queryClient.invalidateQueries("allMedicines");
        queryClient.invalidateQueries("lowStockMedicines");
        queryClient.invalidateQueries("expiringMedicines");
        setIsDeleteModalOpen(false);
        setSelectedMedicine(null);
      },
      onError: () => {
        setError(
          "Failed to delete medicine. It may be referenced in transactions or prescriptions."
        );
      },
    }
  );

  // Confirm delete handler
  const handleDelete = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setIsDeleteModalOpen(true);
  };

  // Execute delete
  const confirmDelete = () => {
    if (selectedMedicine) {
      deleteMedicine.mutate(selectedMedicine.medicineId);
    }
  };

  // Filter medicines based on search query
  const filterMedicines = (medicines: Medicine[] = []) => {
    if (!searchQuery) return medicines;

    return medicines.filter(
      (medicine) =>
        medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medicine.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (medicine.manufacturer &&
          medicine.manufacturer
            .toLowerCase()
            .includes(searchQuery.toLowerCase()))
    );
  };

  // Get current medicines based on active tab
  const getCurrentMedicines = () => {
    switch (activeTab) {
      case "low-stock":
        return filterMedicines(lowStockMedicines);
      case "expiring":
        return filterMedicines(expiringMedicines);
      default:
        return filterMedicines(allMedicines);
    }
  };

  const isLoading =
    (activeTab === "all" && isLoadingAll) ||
    (activeTab === "low-stock" && isLoadingLowStock) ||
    (activeTab === "expiring" && isLoadingExpiring);

  return (
    <>
      <Head>
        <title>Medicine Inventory | Medical Center Management System</title>
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
                <span className="text-gray-900">Medicine Inventory</span>
              </li>
            </ol>
          </nav>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Medicine Inventory
            </h1>
            <p className="text-gray-600 mt-1">
              Manage medicine stock, track inventory, and monitor usage
            </p>
          </div>
          <div className="mt-4 md:mt-0 space-y-2 md:space-y-0 md:space-x-2">
            <Link
              href="/admin/inventory/new"
              className="inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Add New Medicine
            </Link>
            <Link
              href="/admin/inventory/categories"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition ml-2"
            >
              Manage Categories
            </Link>
            <Link
              href="/admin/inventory/transactions"
              className="inline-block px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition ml-2"
            >
              View Transactions
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                className={`${
                  activeTab === "all"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab("all")}
              >
                All Medicines
              </button>
              <button
                className={`${
                  activeTab === "low-stock"
                    ? "border-yellow-500 text-yellow-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab("low-stock")}
              >
                Low Stock
                {lowStockMedicines && lowStockMedicines.length > 0 && (
                  <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-semibold py-0.5 px-2 rounded-full">
                    {lowStockMedicines.length}
                  </span>
                )}
              </button>
              <button
                className={`${
                  activeTab === "expiring"
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab("expiring")}
              >
                Expiring Soon
                {expiringMedicines && expiringMedicines.length > 0 && (
                  <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold py-0.5 px-2 rounded-full">
                    {expiringMedicines.length}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>

        {/* Inventory Statistics */}
        <div className="mb-6">
          <InventoryStatistics />
        </div>

        {/* Search and View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              name="search"
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="Search medicines"
            />
          </div>

          {/* View toggle */}
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 text-sm font-medium rounded ${
                viewMode === "table"
                  ? "bg-white shadow text-green-600"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z"
                    clipRule="evenodd"
                  />
                </svg>
                Table
              </div>
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`px-3 py-1.5 text-sm font-medium rounded ${
                viewMode === "cards"
                  ? "bg-white shadow text-green-600"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                </svg>
                Cards
              </div>
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Medicines Table */}
        {viewMode === "table" ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Stock Qty
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Unit Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Expiry Date
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
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center">
                          <svg
                            className="animate-spin h-5 w-5 text-green-500 mr-3"
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
                          Loading medicines...
                        </div>
                      </td>
                    </tr>
                  ) : getCurrentMedicines()?.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center">
                        {searchQuery ? (
                          <p>
                            No medicines found matching your search criteria.
                          </p>
                        ) : (
                          <p>No medicines available.</p>
                        )}
                      </td>
                    </tr>
                  ) : (
                    getCurrentMedicines()?.map((medicine) => (
                      <tr
                        key={medicine.medicineId}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            href={`/admin/inventory/${medicine.medicineId}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {medicine.name}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {medicine.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              medicine.stockQuantity <= medicine.reorderLevel
                                ? "bg-red-100 text-red-800"
                                : medicine.stockQuantity <=
                                  medicine.reorderLevel * 2
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {medicine.stockQuantity} {medicine.unit}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          ${medicine.unitPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {medicine.expiryDate ? (
                            <span
                              className={
                                new Date(medicine.expiryDate) <
                                new Date(
                                  new Date().setDate(new Date().getDate() + 30)
                                )
                                  ? "text-red-600"
                                  : ""
                              }
                            >
                              {new Date(
                                medicine.expiryDate
                              ).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              window.location.href = `/admin/inventory/transactions?medicineId=${medicine.medicineId}`;
                            }}
                            className="text-purple-600 hover:text-purple-900 mr-4"
                          >
                            Transactions
                          </button>
                          <Link
                            href={`/admin/inventory/${medicine.medicineId}`}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(medicine)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full text-center">
                <div className="flex justify-center items-center">
                  <svg
                    className="animate-spin h-5 w-5 text-green-500 mr-3"
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
                  Loading medicines...
                </div>
              </div>
            ) : getCurrentMedicines()?.length === 0 ? (
              <div className="col-span-full text-center">
                {searchQuery ? (
                  <p>No medicines found matching your search criteria.</p>
                ) : (
                  <p>No medicines available.</p>
                )}
              </div>
            ) : (
              getCurrentMedicines()?.map((medicine) => (
                <MedicineCard
                  key={medicine.medicineId}
                  medicine={medicine}
                  onDelete={() => handleDelete(medicine)}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-red-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Medicine
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete{" "}
                        <span className="font-medium">
                          {selectedMedicine?.name}
                        </span>
                        ? This action cannot be undone, and all transaction
                        history for this medicine will also be deleted.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InventoryPage;
