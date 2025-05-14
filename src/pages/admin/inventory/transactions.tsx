import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { medicineAPI } from "../../../utils/api";
import { InventoryTransaction, Medicine } from "../../../types";

const InventoryTransactionsPage: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { medicineId } = router.query;
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(
    null
  );
  const [transactionForm, setTransactionForm] = useState({
    medicineId: medicineId ? Number(medicineId) : "",
    quantity: 0,
    transactionType: "PURCHASE",
    notes: "",
    transactionDate: new Date().toISOString().split("T")[0],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Effect to update form when medicineId from query changes
  useEffect(() => {
    if (medicineId) {
      setTransactionForm({
        ...transactionForm,
        medicineId: Number(medicineId),
      });
    }
  }, [medicineId]);

  // Fetch all medicines for dropdown
  const { data: allMedicines } = useQuery<Medicine[]>(
    "allMedicines",
    medicineAPI.getAllMedicines,
    {
      onError: () => {
        setError("Failed to load medicines. Please try again later.");
      },
    }
  );

  // Fetch inventory transactions based on filters
  const { data: transactions, isLoading } = useQuery<InventoryTransaction[]>(
    [
      "inventoryTransactions",
      medicineId,
      dateRange.startDate,
      dateRange.endDate,
    ],
    () =>
      medicineAPI.getInventoryTransactions(
        medicineId ? Number(medicineId) : undefined,
        dateRange.startDate,
        dateRange.endDate
      ),
    {
      onError: () => {
        setError(
          "Failed to load inventory transactions. Please try again later."
        );
      },
    }
  );

  // Fetch specific medicine if ID is provided
  useQuery<Medicine>(
    ["medicine", medicineId],
    () => medicineAPI.getMedicineById(Number(medicineId)),
    {
      enabled: !!medicineId,
      onSuccess: (data) => {
        setSelectedMedicine(data);
      },
      onError: () => {
        setError("Failed to load medicine details. Please try again later.");
      },
    }
  );

  // Create transaction mutation
  const createTransaction = useMutation(
    (transactionData: any) =>
      medicineAPI.recordInventoryTransaction(transactionData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("inventoryTransactions");
        queryClient.invalidateQueries("allMedicines");
        queryClient.invalidateQueries("lowStockMedicines");
        queryClient.invalidateQueries("expiringMedicines");

        // If specific medicine, invalidate that query too
        if (medicineId) {
          queryClient.invalidateQueries(["medicine", medicineId]);
        }

        setIsModalOpen(false);
        setIsSubmitting(false);
        setSuccess("Transaction recorded successfully.");
        setTimeout(() => setSuccess(null), 3000);

        // Reset form
        setTransactionForm({
          medicineId: medicineId ? Number(medicineId) : "",
          quantity: 0,
          transactionType: "PURCHASE",
          notes: "",
          transactionDate: new Date().toISOString().split("T")[0],
        });
      },
      onError: () => {
        setError("Failed to record transaction. Please try again.");
        setIsSubmitting(false);
        setTimeout(() => setError(null), 3000);
      },
    }
  );

  // Handle date range changes
  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange({
      ...dateRange,
      [name]: value,
    });
  };

  // Handle transaction form input changes
  const handleTransactionFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "quantity") {
      setTransactionForm({
        ...transactionForm,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setTransactionForm({
        ...transactionForm,
        [name]: value,
      });
    }
  };

  // Handle transaction form submission
  const handleTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate form
    if (!transactionForm.medicineId) {
      setError("Please select a medicine");
      return;
    }

    if (transactionForm.quantity <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }

    setIsSubmitting(true);
    createTransaction.mutate(transactionForm);
  };

  // Get transaction type badge class
  const getTransactionTypeClass = (type: string) => {
    switch (type) {
      case "PURCHASE":
        return "bg-green-100 text-green-800";
      case "SALE":
        return "bg-blue-100 text-blue-800";
      case "ADJUSTMENT":
        return "bg-purple-100 text-purple-800";
      case "RETURN":
        return "bg-yellow-100 text-yellow-800";
      case "EXPIRED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <Head>
        <title>Inventory Transactions | Medical Center Management System</title>
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
                <span className="text-gray-900">Transactions</span>
              </li>
            </ol>
          </nav>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Inventory Transactions
              {selectedMedicine && (
                <span className="text-xl text-gray-600 ml-2">
                  for {selectedMedicine.name}
                </span>
              )}
            </h1>
            <p className="text-gray-600 mt-1">
              Track inventory movements and stock changes
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            <svg
              className="h-5 w-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
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
            Record Transaction
          </button>
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

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medicine
              </label>
              <select
                value={medicineId || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value) {
                    router.push(
                      `/admin/inventory/transactions?medicineId=${value}`
                    );
                  } else {
                    router.push("/admin/inventory/transactions");
                  }
                }}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Medicines</option>
                {allMedicines?.map((medicine) => (
                  <option key={medicine.medicineId} value={medicine.medicineId}>
                    {medicine.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateRangeChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateRangeChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Medicine
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center">
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
                        Loading transactions...
                      </div>
                    </td>
                  </tr>
                ) : transactions?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center">
                      <p>No transactions found for the selected filters.</p>
                    </td>
                  </tr>
                ) : (
                  transactions?.map((transaction) => (
                    <tr
                      key={transaction.transactionId}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(
                          transaction.transactionDate
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/admin/inventory/${transaction.medicineId}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {transaction.medicineName}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTransactionTypeClass(
                            transaction.transactionType
                          )}`}
                        >
                          {transaction.transactionType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={
                            transaction.quantity > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {transaction.quantity > 0 ? "+" : ""}
                          {transaction.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {transaction.notes || (
                          <span className="text-gray-400">No notes</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Record Transaction Modal */}
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={() => setIsModalOpen(false)}
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
              <form onSubmit={handleTransactionSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Record Inventory Transaction
                    </h3>
                    <div className="mt-2 space-y-4">
                      {/* Medicine Selector */}
                      <div>
                        <label
                          htmlFor="medicineId"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Medicine <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="medicineId"
                          name="medicineId"
                          value={transactionForm.medicineId}
                          onChange={handleTransactionFormChange}
                          required
                          disabled={!!medicineId}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="">Select a medicine</option>
                          {allMedicines?.map((medicine) => (
                            <option
                              key={medicine.medicineId}
                              value={medicine.medicineId}
                            >
                              {medicine.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Transaction Type */}
                      <div>
                        <label
                          htmlFor="transactionType"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Transaction Type{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="transactionType"
                          name="transactionType"
                          value={transactionForm.transactionType}
                          onChange={handleTransactionFormChange}
                          required
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="PURCHASE">Purchase (Add Stock)</option>
                          <option value="SALE">Sale (Reduce Stock)</option>
                          <option value="ADJUSTMENT">Adjustment</option>
                          <option value="RETURN">Return</option>
                          <option value="EXPIRED">Expired</option>
                        </select>
                      </div>

                      {/* Quantity */}
                      <div>
                        <label
                          htmlFor="quantity"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Quantity <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          id="quantity"
                          name="quantity"
                          value={transactionForm.quantity}
                          onChange={handleTransactionFormChange}
                          step="0.01"
                          required
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Enter positive values for additions, negative values
                          for reductions
                        </p>
                      </div>

                      {/* Transaction Date */}
                      <div>
                        <label
                          htmlFor="transactionDate"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Transaction Date{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          id="transactionDate"
                          name="transactionDate"
                          value={transactionForm.transactionDate}
                          onChange={handleTransactionFormChange}
                          required
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>

                      {/* Notes */}
                      <div>
                        <label
                          htmlFor="notes"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Notes
                        </label>
                        <textarea
                          id="notes"
                          name="notes"
                          value={transactionForm.notes}
                          onChange={handleTransactionFormChange}
                          rows={3}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Optional notes about this transaction"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm ${
                      isSubmitting && "opacity-75 cursor-not-allowed"
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
                        Recording...
                      </>
                    ) : (
                      "Record Transaction"
                    )}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InventoryTransactionsPage;
