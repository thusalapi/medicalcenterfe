import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { medicineAPI } from "../../utils/api";

interface StockUpdateFormProps {
  medicineId: number;
  medicineName: string;
  currentStock: number;
  unit: string;
  onComplete?: () => void;
}

const StockUpdateForm: React.FC<StockUpdateFormProps> = ({
  medicineId,
  medicineName,
  currentStock,
  unit,
  onComplete,
}) => {
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState<number>(0);
  const [transactionType, setTransactionType] = useState<string>("PURCHASE");
  const [notes, setNotes] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Record inventory transaction mutation
  const recordTransaction = useMutation(
    (transactionData: any) =>
      medicineAPI.recordInventoryTransaction(transactionData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["medicine", medicineId]);
        queryClient.invalidateQueries("allMedicines");
        queryClient.invalidateQueries("lowStockMedicines");
        queryClient.invalidateQueries("expiringMedicines");
        queryClient.invalidateQueries("inventoryTransactions");

        setQuantity(0);
        setNotes("");
        setError(null);
        setIsSubmitting(false);

        if (onComplete) {
          onComplete();
        }
      },
      onError: () => {
        setError("Failed to update stock. Please try again.");
        setIsSubmitting(false);
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (quantity <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }

    // Adjust quantity based on transaction type
    const adjustedQuantity =
      transactionType === "PURCHASE" || transactionType === "RETURN"
        ? Math.abs(quantity)
        : -Math.abs(quantity);

    setIsSubmitting(true);

    recordTransaction.mutate({
      medicineId,
      quantity: adjustedQuantity,
      transactionType,
      notes,
      transactionDate: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <h3 className="font-medium text-lg mb-3">
        Update Stock for {medicineName}
      </h3>

      {error && (
        <div className="mb-4 bg-red-50 text-red-800 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="mb-4">
        <div className="text-sm text-gray-500 mb-1">Current Stock:</div>
        <div className="font-medium">
          {currentStock} {unit}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="transactionType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Transaction Type
            </label>
            <select
              id="transactionType"
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="PURCHASE">Purchase (Add Stock)</option>
              <option value="SALE">Sale (Reduce Stock)</option>
              <option value="ADJUSTMENT">Adjustment</option>
              <option value="RETURN">Return</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="0"
              step="1"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Add notes for this transaction"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isSubmitting ? "Processing..." : "Update Stock"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StockUpdateForm;
