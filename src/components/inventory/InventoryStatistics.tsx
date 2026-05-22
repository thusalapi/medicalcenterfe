import React from "react";
import { useQuery } from "react-query";
import Link from "next/link";
import { medicineAPI } from "../../utils/api";

const InventoryStatistics: React.FC = () => {
  // Fetch inventory statistics
  const { data: inventoryStats, isLoading } = useQuery(
    "inventoryStatistics",
    medicineAPI.getInventoryStats,
    {
      refetchInterval: 300000, // Refetch every 5 minutes
    }
  );

  // Fetch low stock medicines
  const { data: lowStockMedicines } = useQuery(
    "lowStockMedicines",
    medicineAPI.getLowStockMedicines,
    {
      refetchInterval: 300000, // Refetch every 5 minutes
    }
  );

  // Fetch expiring medicines
  const { data: expiringMedicines } = useQuery(
    "expiringMedicines",
    () => medicineAPI.getExpiringMedicines(30),
    {
      refetchInterval: 300000, // Refetch every 5 minutes
    }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="flex items-center">
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
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading inventory statistics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Inventory Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-blue-500 text-lg font-medium">Total Items</div>
          <div className="text-2xl font-bold mt-1">
            {inventoryStats?.totalMedicines || 0}
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-yellow-500 text-lg font-medium">Low Stock</div>
          <div className="text-2xl font-bold mt-1">
            {lowStockMedicines?.length || 0}
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-red-500 text-lg font-medium">Expiring Soon</div>
          <div className="text-2xl font-bold mt-1">
            {expiringMedicines?.length || 0}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-md font-semibold text-gray-700 mb-2">
          Inventory Value
        </h3>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-green-600 text-xl font-bold">
            ${inventoryStats?.totalInventoryValue?.toFixed(2) || "0.00"}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Total value of all medicines
          </div>
        </div>
      </div>

      {lowStockMedicines && lowStockMedicines.length > 0 && (
        <div className="mb-4">
          <h3 className="text-md font-semibold text-gray-700 mb-2">
            Low Stock Items
          </h3>
          <ul className="text-sm divide-y">
            {lowStockMedicines.slice(0, 3).map((medicine: any) => (
              <li key={medicine.medicineId} className="py-2">
                <div className="flex justify-between">
                  <span className="text-gray-800">{medicine.name}</span>
                  <span className="font-medium text-red-600">
                    {medicine.stockQuantity} left
                  </span>
                </div>
              </li>
            ))}
            {lowStockMedicines.length > 3 && (
              <li className="py-2 text-center">
                <a
                  href="/admin/inventory?tab=low-stock"
                  className="text-blue-600 hover:text-blue-800"
                >
                  View all {lowStockMedicines.length} low stock items
                </a>
              </li>
            )}
          </ul>
        </div>
      )}

      {expiringMedicines && expiringMedicines.length > 0 && (
        <div>
          <h3 className="text-md font-semibold text-gray-700 mb-2">
            Expiring Soon
          </h3>
          <ul className="text-sm divide-y">
            {expiringMedicines.slice(0, 3).map((medicine: any) => (
              <li key={medicine.medicineId} className="py-2">
                <div className="flex justify-between">
                  <span className="text-gray-800">{medicine.name}</span>
                  <span className="font-medium text-red-600">
                    {new Date(medicine.expiryDate).toLocaleDateString()}
                  </span>
                </div>
              </li>
            ))}
            {expiringMedicines.length > 3 && (
              <li className="py-2 text-center">
                <a
                  href="/admin/inventory?tab=expiring"
                  className="text-blue-600 hover:text-blue-800"
                >
                  View all {expiringMedicines.length} expiring items
                </a>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default InventoryStatistics;
