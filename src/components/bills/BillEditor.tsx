import React, { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Bill, BillItem, Report } from "../../types";
import { useQuery } from "react-query";
import { reportAPI } from "../../utils/api";

interface BillEditorProps {
  bill: Bill;
  visitId: number;
  onAddItem: (item: any) => Promise<void>;
  onRemoveItem: (itemId: number) => Promise<void>;
  onUpdateTotal: () => Promise<void>;
  readOnly?: boolean;
}

const BillEditor: React.FC<BillEditorProps> = ({
  bill,
  visitId,
  onAddItem,
  onRemoveItem,
  onUpdateTotal,
  readOnly = false,
}) => {
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemAmount, setNewItemAmount] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  // Fetch reports for this visit to potentially add as bill items
  const { data: visitReports } = useQuery<Report[]>(
    ["visitReports", visitId],
    () => reportAPI.getReportsForVisit(visitId),
    {
      enabled: !!visitId && !readOnly,
    }
  );

  // Handle print functionality
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Bill_${bill.billId}`,
    copyStyles: true,
  });

  // Add a new item to the bill
  const handleAddItem = async () => {
    setError(null);
    setSuccess(null);

    if (!newItemDescription) {
      setError("Please enter an item description");
      return;
    }

    if (
      !newItemAmount ||
      isNaN(parseFloat(newItemAmount)) ||
      parseFloat(newItemAmount) <= 0
    ) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      setIsAdding(true);

      await onAddItem({
        itemDescription: newItemDescription,
        amount: parseFloat(newItemAmount),
      });

      setNewItemDescription("");
      setNewItemAmount("");
      setSuccess("Item added successfully");

      setTimeout(() => {
        setSuccess(null);
      }, 3000);

      // Recalculate bill total
      await onUpdateTotal();
    } catch (err) {
      console.error("Error adding bill item:", err);
      setError("Failed to add item. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  // Remove an item from the bill
  const handleRemoveItem = async (itemId: number) => {
    if (readOnly) return;

    try {
      await onRemoveItem(itemId);
      setSuccess("Item removed successfully");

      setTimeout(() => {
        setSuccess(null);
      }, 3000);

      // Recalculate bill total
      await onUpdateTotal();
    } catch (err) {
      console.error("Error removing bill item:", err);
      setError("Failed to remove item. Please try again.");
    }
  };

  // Add a report to the bill as an item
  const handleAddReportAsBillItem = async (report: Report) => {
    try {
      setIsAdding(true);

      await onAddItem({
        itemDescription: `Report: ${report.reportTypeName}`,
        amount: 0, // Set default price or get from configuration
        reportId: report.reportId,
      });

      setSuccess("Report added to bill successfully");

      setTimeout(() => {
        setSuccess(null);
      }, 3000);

      // Recalculate bill total
      await onUpdateTotal();
    } catch (err) {
      console.error("Error adding report to bill:", err);
      setError("Failed to add report to bill. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Bill #{bill.billId}</h2>

        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Print Bill
        </button>
      </div>

      {/* Printable Bill Area */}
      <div ref={printRef} className="mb-6 p-6 border rounded-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Medical Center</h1>
          <p className="text-gray-600">123 Health Street, Medical City</p>
          <p className="text-gray-600">Phone: 123-456-7890</p>
        </div>

        <div className="flex justify-between mb-6">
          <div>
            <h2 className="font-semibold">Bill #: {bill.billId}</h2>
            <p className="text-gray-600">
              Date: {new Date(bill.billDate).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <h2 className="font-semibold">Visit #: {bill.visitId}</h2>
          </div>
        </div>

        <table className="min-w-full mb-4">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-2 px-2">Description</th>
              <th className="text-right py-2 px-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {bill.items && bill.items.length > 0 ? (
              bill.items.map((item) => (
                <tr key={item.billItemId} className="border-b border-gray-200">
                  <td className="py-2 px-2">{item.itemDescription}</td>
                  <td className="text-right py-2 px-2">
                    {item.amount.toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="text-center py-4 text-gray-500">
                  No items in this bill
                </td>
              </tr>
            )}
            <tr className="font-bold">
              <td className="py-4 px-2 text-right">Total:</td>
              <td className="py-4 px-2 text-right">
                {bill.totalAmount.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>
            Thank you for choosing Medical Center for your healthcare needs.
          </p>
          <p>Payment is due upon receipt.</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700">
          {success}
        </div>
      )}

      {!readOnly && (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Add Item</h3>
            <div className="flex flex-wrap -mx-2">
              <div className="px-2 w-full md:w-1/2 mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="description"
                >
                  Description
                </label>
                <input
                  id="description"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newItemDescription}
                  onChange={(e) => setNewItemDescription(e.target.value)}
                  placeholder="Enter item description"
                />
              </div>
              <div className="px-2 w-full md:w-1/4 mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="amount"
                >
                  Amount
                </label>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newItemAmount}
                  onChange={(e) => setNewItemAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="px-2 w-full md:w-1/4 mb-4 flex items-end">
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={handleAddItem}
                  disabled={isAdding}
                >
                  {isAdding ? "Adding..." : "Add Item"}
                </button>
              </div>
            </div>
          </div>

          {visitReports && visitReports.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Add Report to Bill</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {visitReports.map((report) => {
                  const isAlreadyInBill = bill.items.some((item) =>
                    item.itemDescription.includes(report.reportTypeName)
                  );

                  return (
                    <div
                      key={report.reportId}
                      className={`p-4 border rounded-md ${
                        isAlreadyInBill ? "bg-gray-100 opacity-75" : "bg-white"
                      }`}
                    >
                      <div className="font-medium">{report.reportTypeName}</div>
                      <div className="text-sm text-gray-600 mb-2">
                        Created: {new Date(report.createdDate).toLocaleString()}
                      </div>
                      {!isAlreadyInBill ? (
                        <button
                          onClick={() => handleAddReportAsBillItem(report)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          disabled={isAdding}
                        >
                          Add to Bill
                        </button>
                      ) : (
                        <span className="text-gray-500 text-sm">
                          Already in bill
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-2">Bill Items</h3>
        <div className="bg-white overflow-hidden border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                {!readOnly && (
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bill.items && bill.items.length > 0 ? (
                bill.items.map((item) => (
                  <tr key={item.billItemId}>
                    <td className="px-6 py-4 whitespace-normal">
                      {item.itemDescription}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {item.amount.toFixed(2)}
                    </td>
                    {!readOnly && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleRemoveItem(item.billItemId)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={readOnly ? 2 : 3}
                    className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                  >
                    No items in this bill
                  </td>
                </tr>
              )}
              <tr className="font-bold bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  Total:
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {bill.totalAmount.toFixed(2)}
                </td>
                {!readOnly && <td></td>}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BillEditor;
