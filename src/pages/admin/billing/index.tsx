import React, { useState } from "react";
import Link from "next/link";
import Head from "next/head";

export default function BillingSettingsPage() {
  // Mock data - in a real app these would come from API calls
  const [feeStructures, setFeeStructures] = useState([
    {
      id: 1,
      name: "Consultation - General",
      amount: 1200,
      category: "Consultation",
    },
    {
      id: 2,
      name: "Consultation - Specialist",
      amount: 2500,
      category: "Consultation",
    },
    { id: 3, name: "X-Ray", amount: 3500, category: "Diagnostic" },
    { id: 4, name: "Blood Test - Basic", amount: 950, category: "Laboratory" },
    {
      id: 5,
      name: "Blood Test - Complete",
      amount: 1800,
      category: "Laboratory",
    },
    { id: 6, name: "ECG", amount: 1500, category: "Diagnostic" },
    { id: 7, name: "Ultrasound", amount: 4000, category: "Diagnostic" },
  ]);

  const [taxRates, setTaxRates] = useState([
    { id: 1, name: "Standard Rate", percentage: 15, isActive: true },
    {
      id: 2,
      name: "Reduced Rate - Essential Services",
      percentage: 5,
      isActive: true,
    },
    { id: 3, name: "Zero Rate", percentage: 0, isActive: true },
  ]);

  const [discountTypes, setDiscountTypes] = useState([
    { id: 1, name: "Senior Citizen", percentage: 10, isActive: true },
    { id: 2, name: "Healthcare Worker", percentage: 15, isActive: true },
    { id: 3, name: "Student", percentage: 5, isActive: true },
    { id: 4, name: "Regular Patient", percentage: 8, isActive: false },
  ]);

  // State for modals
  const [isAddFeeModalOpen, setIsAddFeeModalOpen] = useState(false);
  const [isAddTaxModalOpen, setIsAddTaxModalOpen] = useState(false);
  const [isAddDiscountModalOpen, setIsAddDiscountModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("fees");
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form states
  const [newFee, setNewFee] = useState({
    name: "",
    amount: "",
    category: "Consultation",
  });

  const [newTax, setNewTax] = useState({
    name: "",
    percentage: "",
    isActive: true,
  });

  const [newDiscount, setNewDiscount] = useState({
    name: "",
    percentage: "",
    isActive: true,
  });

  // Filter state
  const [feeFilter, setFeeFilter] = useState("All");
  const categories = [
    "All",
    "Consultation",
    "Laboratory",
    "Diagnostic",
    "Procedure",
    "Other",
  ];

  // Handle fee structure input change
  const handleFeeInputChange = (e) => {
    const { name, value } = e.target;
    setNewFee((prev) => ({ ...prev, [name]: value }));
  };

  // Handle tax rate input change
  const handleTaxInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewTax((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle discount type input change
  const handleDiscountInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewDiscount((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Add or update fee structure
  const handleSubmitFee = (e) => {
    e.preventDefault();

    if (!newFee.name || !newFee.amount) {
      alert("Please fill in all required fields");
      return;
    }

    if (editingItem) {
      // Update existing fee structure
      setFeeStructures(
        feeStructures.map((fee) =>
          fee.id === editingItem.id
            ? {
                ...fee,
                name: newFee.name,
                amount: parseFloat(newFee.amount as string),
                category: newFee.category,
              }
            : fee
        )
      );
    } else {
      // Add new fee structure
      const newId = Math.max(...feeStructures.map((fee) => fee.id)) + 1;
      setFeeStructures([
        ...feeStructures,
        {
          id: newId,
          name: newFee.name,
          amount: parseFloat(newFee.amount as string),
          category: newFee.category,
        },
      ]);
    }

    resetFeeForm();
  };

  // Add or update tax rate
  const handleSubmitTax = (e) => {
    e.preventDefault();

    if (!newTax.name || !newTax.percentage) {
      alert("Please fill in all required fields");
      return;
    }

    if (editingItem) {
      // Update existing tax rate
      setTaxRates(
        taxRates.map((tax) =>
          tax.id === editingItem.id
            ? {
                ...tax,
                name: newTax.name,
                percentage: parseFloat(newTax.percentage as string),
                isActive: newTax.isActive,
              }
            : tax
        )
      );
    } else {
      // Add new tax rate
      const newId = taxRates.length
        ? Math.max(...taxRates.map((tax) => tax.id)) + 1
        : 1;
      setTaxRates([
        ...taxRates,
        {
          id: newId,
          name: newTax.name,
          percentage: parseFloat(newTax.percentage as string),
          isActive: newTax.isActive,
        },
      ]);
    }

    resetTaxForm();
  };

  // Add or update discount type
  const handleSubmitDiscount = (e) => {
    e.preventDefault();

    if (!newDiscount.name || !newDiscount.percentage) {
      alert("Please fill in all required fields");
      return;
    }

    if (editingItem) {
      // Update existing discount type
      setDiscountTypes(
        discountTypes.map((discount) =>
          discount.id === editingItem.id
            ? {
                ...discount,
                name: newDiscount.name,
                percentage: parseFloat(newDiscount.percentage as string),
                isActive: newDiscount.isActive,
              }
            : discount
        )
      );
    } else {
      // Add new discount type
      const newId = discountTypes.length
        ? Math.max(...discountTypes.map((discount) => discount.id)) + 1
        : 1;
      setDiscountTypes([
        ...discountTypes,
        {
          id: newId,
          name: newDiscount.name,
          percentage: parseFloat(newDiscount.percentage as string),
          isActive: newDiscount.isActive,
        },
      ]);
    }

    resetDiscountForm();
  };

  // Edit fee structure
  const editFee = (fee) => {
    setEditingItem(fee);
    setNewFee({
      name: fee.name,
      amount: fee.amount.toString(),
      category: fee.category,
    });
    setIsAddFeeModalOpen(true);
  };

  // Edit tax rate
  const editTax = (tax) => {
    setEditingItem(tax);
    setNewTax({
      name: tax.name,
      percentage: tax.percentage.toString(),
      isActive: tax.isActive,
    });
    setIsAddTaxModalOpen(true);
  };

  // Edit discount type
  const editDiscount = (discount) => {
    setEditingItem(discount);
    setNewDiscount({
      name: discount.name,
      percentage: discount.percentage.toString(),
      isActive: discount.isActive,
    });
    setIsAddDiscountModalOpen(true);
  };

  // Reset forms and close modals
  const resetFeeForm = () => {
    setNewFee({ name: "", amount: "", category: "Consultation" });
    setEditingItem(null);
    setIsAddFeeModalOpen(false);
  };

  const resetTaxForm = () => {
    setNewTax({ name: "", percentage: "", isActive: true });
    setEditingItem(null);
    setIsAddTaxModalOpen(false);
  };

  const resetDiscountForm = () => {
    setNewDiscount({ name: "", percentage: "", isActive: true });
    setEditingItem(null);
    setIsAddDiscountModalOpen(false);
  };

  // Toggle active status
  const toggleTaxStatus = (id) => {
    setTaxRates(
      taxRates.map((tax) =>
        tax.id === id ? { ...tax, isActive: !tax.isActive } : tax
      )
    );
  };

  const toggleDiscountStatus = (id) => {
    setDiscountTypes(
      discountTypes.map((discount) =>
        discount.id === id
          ? { ...discount, isActive: !discount.isActive }
          : discount
      )
    );
  };

  // Delete items
  const deleteFee = (id) => {
    if (confirm("Are you sure you want to delete this fee structure?")) {
      setFeeStructures(feeStructures.filter((fee) => fee.id !== id));
    }
  };

  const deleteTax = (id) => {
    if (confirm("Are you sure you want to delete this tax rate?")) {
      setTaxRates(taxRates.filter((tax) => tax.id !== id));
    }
  };

  const deleteDiscount = (id) => {
    if (confirm("Are you sure you want to delete this discount type?")) {
      setDiscountTypes(discountTypes.filter((discount) => discount.id !== id));
    }
  };

  // Filter fee structures by category
  const filteredFees =
    feeFilter === "All"
      ? feeStructures
      : feeStructures.filter((fee) => fee.category === feeFilter);

  return (
    <>
      <Head>
        <title>Billing Settings | Medical Center Management System</title>
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
                <span className="text-gray-900">Billing Settings</span>
              </li>
            </ol>
          </nav>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Billing Settings
            </h1>
            <p className="text-gray-600 mt-1">
              Configure fee structures, tax rates, and discount types
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex">
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "fees"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } mr-8`}
              onClick={() => setActiveTab("fees")}
            >
              Fee Structure
            </button>
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "taxes"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } mr-8`}
              onClick={() => setActiveTab("taxes")}
            >
              Tax Rates
            </button>
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "discounts"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("discounts")}
            >
              Discount Types
            </button>
          </nav>
        </div>

        {/* Fee Structure Tab */}
        {activeTab === "fees" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <span className="mr-2 text-gray-700">Filter by Category:</span>
                <select
                  className="border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={feeFilter}
                  onChange={(e) => setFeeFilter(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setEditingItem(null);
                  setNewFee({ name: "", amount: "", category: "Consultation" });
                  setIsAddFeeModalOpen(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Fee Structure
              </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {filteredFees.length > 0 ? (
                  filteredFees.map((fee) => (
                    <li key={fee.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {fee.name}
                          </h3>
                          <div className="mt-1 flex items-center">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {fee.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="text-xl font-semibold text-gray-900 mr-8">
                            Rs. {fee.amount.toFixed(2)}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => editFee(fee)}
                              className="p-2 text-blue-600 hover:text-blue-800"
                            >
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
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => deleteFee(fee.id)}
                              className="p-2 text-red-600 hover:text-red-800"
                            >
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
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="px-6 py-12 text-center">
                    <p className="text-gray-500 text-lg">
                      No fee structures found for this category.
                    </p>
                    <button
                      onClick={() => {
                        setEditingItem(null);
                        setNewFee({
                          name: "",
                          amount: "",
                          category:
                            feeFilter !== "All" ? feeFilter : "Consultation",
                        });
                        setIsAddFeeModalOpen(true);
                      }}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Add {feeFilter !== "All" ? feeFilter : "New"} Fee
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </>
        )}

        {/* Tax Rates Tab */}
        {activeTab === "taxes" && (
          <>
            <div className="flex justify-end mb-6">
              <button
                onClick={() => {
                  setEditingItem(null);
                  setNewTax({ name: "", percentage: "", isActive: true });
                  setIsAddTaxModalOpen(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Tax Rate
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {taxRates.map((tax) => (
                <div
                  key={tax.id}
                  className={`bg-white overflow-hidden shadow rounded-lg border ${
                    tax.isActive ? "border-green-200" : "border-gray-200"
                  }`}
                >
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
                          />
                        </svg>
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          {tax.name}
                        </h3>
                        <p className="max-w-2xl text-sm text-gray-500 mt-1">
                          {tax.percentage}% tax rate
                        </p>
                      </div>
                      <div className="ml-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            tax.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {tax.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 bg-gray-50 px-4 py-4 sm:px-6 flex justify-between">
                    <button
                      onClick={() => toggleTaxStatus(tax.id)}
                      className={`px-4 py-2 rounded text-sm font-medium ${
                        tax.isActive
                          ? "text-red-700 hover:bg-red-100"
                          : "text-green-700 hover:bg-green-100"
                      }`}
                    >
                      {tax.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => editTax(tax)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTax(tax.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {taxRates.length === 0 && (
                <div className="col-span-full bg-white shadow rounded-lg p-8 text-center">
                  <p className="text-gray-500 text-lg mb-4">
                    No tax rates configured.
                  </p>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setNewTax({ name: "", percentage: "", isActive: true });
                      setIsAddTaxModalOpen(true);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add First Tax Rate
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Discount Types Tab */}
        {activeTab === "discounts" && (
          <>
            <div className="flex justify-end mb-6">
              <button
                onClick={() => {
                  setEditingItem(null);
                  setNewDiscount({ name: "", percentage: "", isActive: true });
                  setIsAddDiscountModalOpen(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Discount Type
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {discountTypes.map((discount) => (
                <div
                  key={discount.id}
                  className={`bg-white overflow-hidden shadow rounded-lg border ${
                    discount.isActive ? "border-purple-200" : "border-gray-200"
                  }`}
                >
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-purple-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          {discount.name}
                        </h3>
                        <p className="max-w-2xl text-sm text-gray-500 mt-1">
                          {discount.percentage}% discount
                        </p>
                      </div>
                      <div className="ml-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            discount.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {discount.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 bg-gray-50 px-4 py-4 sm:px-6 flex justify-between">
                    <button
                      onClick={() => toggleDiscountStatus(discount.id)}
                      className={`px-4 py-2 rounded text-sm font-medium ${
                        discount.isActive
                          ? "text-red-700 hover:bg-red-100"
                          : "text-green-700 hover:bg-green-100"
                      }`}
                    >
                      {discount.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => editDiscount(discount)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteDiscount(discount.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {discountTypes.length === 0 && (
                <div className="col-span-full bg-white shadow rounded-lg p-8 text-center">
                  <p className="text-gray-500 text-lg mb-4">
                    No discount types configured.
                  </p>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setNewDiscount({
                        name: "",
                        percentage: "",
                        isActive: true,
                      });
                      setIsAddDiscountModalOpen(true);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Add First Discount Type
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Add/Edit Fee Structure Modal */}
        {isAddFeeModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingItem ? "Edit Fee Structure" : "Add Fee Structure"}
                </h3>
                <button
                  className="text-gray-400 hover:text-gray-500"
                  onClick={resetFeeForm}
                >
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmitFee}>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Service Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newFee.name}
                      onChange={handleFeeInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Amount (Rs.)
                    </label>
                    <input
                      type="number"
                      name="amount"
                      id="amount"
                      min="0"
                      step="0.01"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newFee.amount}
                      onChange={handleFeeInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Category
                    </label>
                    <select
                      name="category"
                      id="category"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newFee.category}
                      onChange={handleFeeInputChange}
                    >
                      {categories.slice(1).map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={resetFeeForm}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    {editingItem ? "Update" : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add/Edit Tax Rate Modal */}
        {isAddTaxModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingItem ? "Edit Tax Rate" : "Add Tax Rate"}
                </h3>
                <button
                  className="text-gray-400 hover:text-gray-500"
                  onClick={resetTaxForm}
                >
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmitTax}>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="tax-name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Tax Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="tax-name"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newTax.name}
                      onChange={handleTaxInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="tax-percentage"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Percentage (%)
                    </label>
                    <input
                      type="number"
                      name="percentage"
                      id="tax-percentage"
                      min="0"
                      max="100"
                      step="0.01"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newTax.percentage}
                      onChange={handleTaxInputChange}
                      required
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      id="tax-active"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={newTax.isActive}
                      onChange={handleTaxInputChange}
                    />
                    <label
                      htmlFor="tax-active"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Active
                    </label>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={resetTaxForm}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {editingItem ? "Update" : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add/Edit Discount Type Modal */}
        {isAddDiscountModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingItem ? "Edit Discount Type" : "Add Discount Type"}
                </h3>
                <button
                  className="text-gray-400 hover:text-gray-500"
                  onClick={resetDiscountForm}
                >
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmitDiscount}>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="discount-name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Discount Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="discount-name"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newDiscount.name}
                      onChange={handleDiscountInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="discount-percentage"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Percentage (%)
                    </label>
                    <input
                      type="number"
                      name="percentage"
                      id="discount-percentage"
                      min="0"
                      max="100"
                      step="0.01"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newDiscount.percentage}
                      onChange={handleDiscountInputChange}
                      required
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      id="discount-active"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={newDiscount.isActive}
                      onChange={handleDiscountInputChange}
                    />
                    <label
                      htmlFor="discount-active"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Active
                    </label>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={resetDiscountForm}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    {editingItem ? "Update" : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
