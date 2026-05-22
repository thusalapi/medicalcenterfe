import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { medicineAPI } from "../../../utils/api";
import { Medicine, UpdateMedicineRequest } from "../../../types";
import MedicineCard from "../../../components/inventory/MedicineCard";
import StockUpdateForm from "../../../components/inventory/StockUpdateForm";

const MedicineDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const isNewMedicine = id === "new";
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    unit: "",
    unitPrice: 0,
    stockQuantity: 0,
    batchNumber: "",
    expiryDate: "",
    manufacturer: "",
    reorderLevel: 5,
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch medicine data if editing
  const { data: medicineData, isLoading: isLoadingMedicine } = useQuery(
    ["medicine", id],
    () => medicineAPI.getMedicineById(Number(id)),
    {
      enabled: !isNewMedicine && typeof id === "string",
      onError: () => {
        setError("Failed to load medicine data. Please try again later.");
      },
      onSuccess: (data) => {
        // Format date for the date input
        let formattedData = { ...data };
        if (formattedData.expiryDate) {
          formattedData.expiryDate = new Date(formattedData.expiryDate)
            .toISOString()
            .split("T")[0];
        }
        setFormData(formattedData);
      },
    }
  );

  // Fetch categories for dropdown
  const { data: categories } = useQuery(
    "medicineCategories",
    medicineAPI.getMedicineCategories,
    {
      onError: () => {
        setError("Failed to load medicine categories. Please try again later.");
      },
    }
  );

  // Create or update mutation
  const mutationFn = isNewMedicine
    ? (data: any) => medicineAPI.createMedicine(data)
    : (data: any) => medicineAPI.updateMedicine(Number(id), data);

  const mutation = useMutation(mutationFn, {
    onSuccess: () => {
      queryClient.invalidateQueries("allMedicines");
      queryClient.invalidateQueries("lowStockMedicines");
      queryClient.invalidateQueries("expiringMedicines");

      if (isNewMedicine) {
        setSuccess("Medicine created successfully!");
        // Reset form
        setFormData({
          name: "",
          description: "",
          category: "",
          unit: "",
          unitPrice: 0,
          stockQuantity: 0,
          batchNumber: "",
          expiryDate: "",
          manufacturer: "",
          reorderLevel: 5,
        });
      } else {
        setSuccess("Medicine updated successfully!");
      }

      setIsSubmitting(false);

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/admin/inventory");
      }, 1500);
    },
    onError: () => {
      setError("Failed to save medicine. Please try again.");
      setIsSubmitting(false);
    },
  });

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Handle number inputs
    if (
      name === "unitPrice" ||
      name === "stockQuantity" ||
      name === "reorderLevel"
    ) {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate form
    if (!formData.name.trim()) {
      setError("Medicine name is required");
      return;
    }

    if (!formData.category) {
      setError("Medicine category is required");
      return;
    }

    if (!formData.unit) {
      setError("Unit of measurement is required");
      return;
    }

    setIsSubmitting(true);
    mutation.mutate(formData);
  };

  return (
    <>
      <Head>
        <title>
          {isNewMedicine ? "Add New Medicine" : "Edit Medicine"} | Medical
          Center Management System
        </title>
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
                <Link
                  href="/admin/inventory"
                  className="text-gray-500 hover:text-gray-700"
                >
                  Medicine Inventory
                </Link>
              </li>
              <li>
                <span className="text-gray-400 mx-1">/</span>
                <span className="text-gray-900">
                  {isNewMedicine ? "Add Medicine" : "Edit Medicine"}
                </span>
              </li>
            </ol>
          </nav>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {isNewMedicine ? "Add New Medicine" : "Edit Medicine"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isNewMedicine
              ? "Add a new medicine to the inventory"
              : "Edit medicine information and stock levels"}
          </p>
        </div>

        {/* Error and success messages */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
            <p>{success}</p>
          </div>
        )}

        {/* Loading indicator */}
        {!isNewMedicine && isLoadingMedicine ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex items-center">
              <svg
                className="animate-spin h-8 w-8 text-green-500 mr-3"
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
              <span className="text-xl">Loading medicine data...</span>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <form onSubmit={handleSubmit}>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Medicine Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Medicine Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select a category</option>
                      {categories?.map((category: any) => (
                        <option key={category.categoryId} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                      {/* Fallback options if API doesn't return categories */}
                      {!categories && (
                        <>
                          <option value="Antibiotics">Antibiotics</option>
                          <option value="Painkillers">Painkillers</option>
                          <option value="Antihistamines">Antihistamines</option>
                          <option value="Vitamins">Vitamins</option>
                          <option value="Topical">Topical</option>
                          <option value="Cardiovascular">Cardiovascular</option>
                          <option value="Respiratory">Respiratory</option>
                          <option value="Gastrointestinal">
                            Gastrointestinal
                          </option>
                          <option value="Other">Other</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* Unit */}
                  <div>
                    <label
                      htmlFor="unit"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Unit <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="unit"
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select unit</option>
                      <option value="Tablet">Tablet</option>
                      <option value="Capsule">Capsule</option>
                      <option value="ml">ml</option>
                      <option value="Bottle">Bottle</option>
                      <option value="Ampule">Ampule</option>
                      <option value="Vial">Vial</option>
                      <option value="g">g</option>
                      <option value="mg">mg</option>
                      <option value="Tube">Tube</option>
                      <option value="Pack">Pack</option>
                      <option value="Inhaler">Inhaler</option>
                    </select>
                  </div>

                  {/* Unit Price */}
                  <div>
                    <label
                      htmlFor="unitPrice"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Unit Price ($) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="unitPrice"
                      name="unitPrice"
                      value={formData.unitPrice}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  {/* Stock Quantity */}
                  <div>
                    <label
                      htmlFor="stockQuantity"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Stock Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="stockQuantity"
                      name="stockQuantity"
                      value={formData.stockQuantity}
                      onChange={handleChange}
                      min="0"
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  {/* Reorder Level */}
                  <div>
                    <label
                      htmlFor="reorderLevel"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Reorder Level <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="reorderLevel"
                      name="reorderLevel"
                      value={formData.reorderLevel}
                      onChange={handleChange}
                      min="0"
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Alert will be shown when stock falls below this level
                    </p>
                  </div>

                  {/* Manufacturer */}
                  <div>
                    <label
                      htmlFor="manufacturer"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Manufacturer
                    </label>
                    <input
                      type="text"
                      id="manufacturer"
                      name="manufacturer"
                      value={formData.manufacturer || ""}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  {/* Batch Number */}
                  <div>
                    <label
                      htmlFor="batchNumber"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Batch Number
                    </label>
                    <input
                      type="text"
                      id="batchNumber"
                      name="batchNumber"
                      value={formData.batchNumber || ""}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  {/* Expiry Date */}
                  <div>
                    <label
                      htmlFor="expiryDate"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.expiryDate || ""}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="mt-6">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  ></textarea>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 text-right">
                <Link
                  href="/admin/inventory"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-4"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isSubmitting
                      ? "bg-green-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  }`}
                >
                  {isSubmitting ? (
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
                  ) : isNewMedicine ? (
                    "Add Medicine"
                  ) : (
                    "Update Medicine"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
        {!isNewMedicine && medicineData && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Medicine Information
              </h3>
              <MedicineCard medicine={medicineData} showActions={false} />
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Quick Stock Update
              </h3>
              <StockUpdateForm
                medicineId={Number(id)}
                medicineName={medicineData.name}
                currentStock={medicineData.stockQuantity}
                unit={medicineData.unit}
                onComplete={() =>
                  queryClient.invalidateQueries(["medicine", id])
                }
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MedicineDetailPage;
