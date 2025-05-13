import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";
import { billAPI, visitAPI } from "../../utils/api";
import BillEditor from "../../components/bills/BillEditor";
import { Bill, Visit } from "../../types";

const NewBillPage: React.FC = () => {
  const router = useRouter();
  const { visitId } = router.query;
  const [error, setError] = useState<string | null>(null);
  const [bill, setBill] = useState<Bill | null>(null);

  // Check if visitId exists in the URL
  const parsedVisitId = visitId ? parseInt(visitId as string) : undefined;

  // Fetch visit information
  const { data: visit, isLoading: isVisitLoading } = useQuery(
    ["visit", parsedVisitId],
    () => visitAPI.getVisitById(parsedVisitId as number),
    {
      enabled: !!parsedVisitId,
      onError: () => {
        setError("Failed to fetch visit information. Please try again.");
      },
    }
  );

  // Create bill mutation
  const createBillMutation = useMutation(
    (data: any) => billAPI.createBill(data),
    {
      onSuccess: (newBill) => {
        setBill(newBill);
      },
      onError: () => {
        setError("Failed to create bill. Please try again.");
      },
    }
  );

  // Add bill item mutation
  const addBillItemMutation = useMutation(
    ({ billId, itemData }: { billId: number; itemData: any }) =>
      billAPI.addItemToBill(billId, itemData),
    {
      onSuccess: (newItem) => {
        if (bill) {
          setBill({
            ...bill,
            items: [...bill.items, newItem],
          });
        }
      },
      onError: () => {
        setError("Failed to add item to bill. Please try again.");
      },
    }
  );
  // Remove bill item mutation
  const removeBillItemMutation = useMutation(
    ({ billId, itemId }: { billId: number; itemId: number }) =>
      billAPI.removeBillItem(billId, itemId),
    {
      onSuccess: (_, variables) => {
        if (bill) {
          setBill({
            ...bill,
            items: bill.items.filter(
              (item) => item.billItemId !== variables.itemId
            ),
          });
        }
      },
      onError: () => {
        setError("Failed to remove item from bill. Please try again.");
      },
    }
  );

  // Recalculate bill total mutation
  const recalculateBillMutation = useMutation(
    (billId: number) => billAPI.recalculateBillTotal(billId),
    {
      onSuccess: (updatedBill) => {
        setBill(updatedBill);
      },
      onError: () => {
        setError("Failed to recalculate bill total. Please try again.");
      },
    }
  );

  // Create bill on component mount if visitId is provided
  useEffect(() => {
    if (parsedVisitId && !bill) {
      createBillMutation.mutate({ visitId: parsedVisitId });
    }
  }, [parsedVisitId]);

  // Handlers for bill operations
  const handleAddItem = async (itemData: any) => {
    if (bill) {
      return addBillItemMutation.mutateAsync({
        billId: bill.billId,
        itemData,
      });
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    if (bill) {
      return removeBillItemMutation.mutateAsync({
        billId: bill.billId,
        itemId,
      });
    }
  };

  const handleUpdateTotal = async () => {
    if (bill) {
      return recalculateBillMutation.mutateAsync(bill.billId);
    }
  };

  // Determine what to render based on state
  const renderContent = () => {
    if (isVisitLoading || createBillMutation.isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Return to Dashboard
          </button>
        </div>
      );
    }

    if (!parsedVisitId) {
      return (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mb-6">
          <p className="text-yellow-800">
            No visit specified. Please select a visit to create a bill for.
          </p>
          <button
            onClick={() => router.push("/visits")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Browse Visits
          </button>
        </div>
      );
    }

    if (bill) {
      return (
        <>
          <div className="mb-6">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-blue-800">
                <strong>Visit Information:</strong> {visit?.patientName} -{" "}
                {new Date(visit?.visitDate).toLocaleString()}
              </p>
            </div>
          </div>

          <BillEditor
            bill={bill}
            visitId={parsedVisitId}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            onUpdateTotal={handleUpdateTotal}
          />
        </>
      );
    }

    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Bill</h1>
      {renderContent()}
    </div>
  );
};

export default NewBillPage;
