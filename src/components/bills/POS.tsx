import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { billAPI } from "../../utils/api";
import { Bill, BillItem } from "../../types";
import { FaTrash, FaPrint, FaSave } from "react-icons/fa";

interface POSProps {
  visitId: number;
  readOnly?: boolean;
}

const POS: React.FC<POSProps> = ({ visitId, readOnly = false }) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{
    itemDescription: string;
    amount: string;
  }>();

  // Fetch bill for current visit
  const {
    data: bill,
    isLoading: billLoading,
    refetch: refetchBill,
  } = useQuery<Bill>(
    ["visitBill", visitId],
    () => billAPI.getBillByVisitId(visitId),
    {
      enabled: !!visitId,
      onError: () => {
        // Bill doesn't exist yet
      },
    }
  );

  // Create bill mutation
  const createBillMutation = useMutation(
    () => billAPI.createBill({ visitId }),
    {
      onSuccess: () => {
        setSuccess("Bill created successfully");
        refetchBill();
        queryClient.invalidateQueries(["visitBill", visitId]);
      },
      onError: (error: any) => {
        setError(
          "Error creating bill: " + (error.message || "Please try again")
        );
      },
    }
  );

  // Add item mutation
  const addItemMutation = useMutation(
    (itemData: { itemDescription: string; amount: number }) =>
      billAPI.addItemToBill(bill?.billId!, itemData),
    {
      onSuccess: () => {
        setSuccess("Item added successfully");
        reset();
        queryClient.invalidateQueries(["visitBill", visitId]);
        // Recalculate total
        recalculateTotalMutation.mutate(bill?.billId!);
      },
      onError: (error: any) => {
        setError("Error adding item: " + (error.message || "Please try again"));
      },
    }
  );

  // Remove item mutation
  const removeItemMutation = useMutation(
    (itemId: number) => billAPI.removeBillItem(bill?.billId!, itemId),
    {
      onSuccess: () => {
        setSuccess("Item removed successfully");
        queryClient.invalidateQueries(["visitBill", visitId]);
        // Recalculate total
        recalculateTotalMutation.mutate(bill?.billId!);
      },
      onError: (error: any) => {
        setError(
          "Error removing item: " + (error.message || "Please try again")
        );
      },
    }
  );

  // Recalculate total mutation
  const recalculateTotalMutation = useMutation(
    (billId: number) => billAPI.recalculateBillTotal(billId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["visitBill", visitId]);
      },
    }
  );

  // Generate PDF mutation
  const generatePdfMutation = useMutation(
    () => billAPI.generateBillPdf(bill?.billId!),
    {
      onSuccess: (data) => {
        // Create blob URL from the PDF data
        const blob = new Blob([data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        // Open the PDF in a new window
        window.open(url);
      },
      onError: (error: any) => {
        setError(
          "Error generating PDF: " + (error.message || "Please try again")
        );
      },
    }
  );

  // Handle form submission to add a new item
  const onSubmit = (data: { itemDescription: string; amount: string }) => {
    if (!bill?.billId) return;

    addItemMutation.mutate({
      itemDescription: data.itemDescription,
      amount: parseFloat(data.amount),
    });
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  if (billLoading) {
    return <div className="text-center py-10">Loading bill information...</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Bill Management</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4">
          {success}
        </div>
      )}

      {!bill ? (
        <div className="text-center py-4">
          <p className="mb-4">No bill created for this visit yet.</p>
          <button
            onClick={() => createBillMutation.mutate()}
            disabled={createBillMutation.isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {createBillMutation.isLoading ? "Creating..." : "Create Bill"}
          </button>
        </div>
      ) : (
        <div>
          {/* Bill Information */}
          <div className="mb-6 pb-4 border-b border-gray-200">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Bill ID:</span>
              <span className="font-medium">{bill.billId}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Date:</span>
              <span>{new Date(bill.billDate).toLocaleString()}</span>
            </div>
          </div>

          {/* Bill Items */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Items</h3>
            {bill.items && bill.items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Description
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Amount
                      </th>
                      {!readOnly && (
                        <th
                          scope="col"
                          className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bill.items.map((item: BillItem) => (
                      <tr key={item.billItemId}>
                        <td className="px-4 py-2">{item.itemDescription}</td>
                        <td className="px-4 py-2 text-right">
                          {formatCurrency(item.amount)}
                        </td>
                        {!readOnly && (
                          <td className="px-4 py-2 text-right">
                            <button
                              onClick={() =>
                                removeItemMutation.mutate(item.billItemId)
                              }
                              className="text-red-600 hover:text-red-800"
                              title="Remove item"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-bold">
                      <td className="px-4 py-3">Total</td>
                      <td className="px-4 py-3 text-right">
                        {formatCurrency(bill.totalAmount)}
                      </td>
                      {!readOnly && <td></td>}
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No items added to this bill yet.
              </p>
            )}
          </div>

          {/* Add Item Form (if not read-only) */}
          {!readOnly && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Add New Item</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-8">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      {...register("itemDescription", {
                        required: "Description is required",
                      })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    {errors.itemDescription && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.itemDescription.message}
                      </p>
                    )}
                  </div>
                  <div className="col-span-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register("amount", {
                        required: "Amount is required",
                        min: {
                          value: 0.01,
                          message: "Amount must be positive",
                        },
                      })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    {errors.amount && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.amount.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={addItemMutation.isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                  >
                    {addItemMutation.isLoading ? "Adding..." : "Add Item"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            {bill.items && bill.items.length > 0 && (
              <button
                onClick={() => generatePdfMutation.mutate()}
                disabled={generatePdfMutation.isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center disabled:bg-green-300"
              >
                <FaPrint className="mr-2" />
                {generatePdfMutation.isLoading
                  ? "Generating..."
                  : "Print/Download"}
              </button>
            )}
            {!readOnly && (
              <button
                onClick={() => recalculateTotalMutation.mutate(bill.billId)}
                disabled={recalculateTotalMutation.isLoading}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center disabled:bg-gray-300"
              >
                <FaSave className="mr-2" />
                {recalculateTotalMutation.isLoading
                  ? "Updating..."
                  : "Update Total"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;
