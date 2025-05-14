import React from "react";
import Link from "next/link";
import { Medicine } from "../../types";

interface MedicineCardProps {
  medicine: Medicine;
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const MedicineCard: React.FC<MedicineCardProps> = ({
  medicine,
  showActions = true,
  onEdit,
  onDelete,
}) => {
  const isExpiringSoon =
    medicine.expiryDate &&
    new Date(medicine.expiryDate) <
      new Date(new Date().setDate(new Date().getDate() + 30));

  const isLowStock = medicine.stockQuantity <= medicine.reorderLevel;

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              {medicine.name}
            </h3>
            <p className="text-sm text-gray-600">{medicine.category}</p>
          </div>

          {/* Stock Status Indicators */}
          <div className="flex space-x-2">
            {isLowStock && (
              <span className="px-2 py-1 text-xs rounded-md bg-red-100 text-red-800 whitespace-nowrap">
                Low Stock
              </span>
            )}
            {isExpiringSoon && (
              <span className="px-2 py-1 text-xs rounded-md bg-yellow-100 text-yellow-800 whitespace-nowrap">
                Expiring Soon
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Stock Quantity:</div>
            <div
              className={`font-medium ${
                isLowStock ? "text-red-600" : "text-gray-900"
              }`}
            >
              {medicine.stockQuantity} {medicine.unit}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500">Unit Price:</div>
            <div className="font-medium text-gray-900">
              ${medicine.unitPrice.toFixed(2)}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500">Reorder Level:</div>
            <div className="font-medium text-gray-900">
              {medicine.reorderLevel} {medicine.unit}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500">Expiry Date:</div>
            <div
              className={`font-medium ${
                isExpiringSoon ? "text-red-600" : "text-gray-900"
              }`}
            >
              {medicine.expiryDate
                ? new Date(medicine.expiryDate).toLocaleDateString()
                : "N/A"}
            </div>
          </div>
        </div>

        {medicine.description && (
          <div className="mt-4">
            <div className="text-sm text-gray-500">Description:</div>
            <div className="text-sm text-gray-700 mt-1">
              {medicine.description}
            </div>
          </div>
        )}

        {medicine.manufacturer && (
          <div className="mt-4">
            <div className="text-sm text-gray-500">Manufacturer:</div>
            <div className="text-sm text-gray-700">{medicine.manufacturer}</div>
          </div>
        )}

        {medicine.batchNumber && (
          <div className="mt-2">
            <div className="text-sm text-gray-500">Batch Number:</div>
            <div className="text-sm text-gray-700">{medicine.batchNumber}</div>
          </div>
        )}
      </div>

      {showActions && (
        <div className="border-t border-gray-200 bg-gray-50 px-5 py-3 flex justify-between">
          <div>
            <Link
              href={`/admin/inventory/transactions?medicineId=${medicine.medicineId}`}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View Transactions
            </Link>
          </div>
          <div className="space-x-3">
            {onEdit && (
              <button
                onClick={onEdit}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineCard;
