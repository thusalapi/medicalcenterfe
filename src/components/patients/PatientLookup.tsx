import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { patientAPI } from "../../utils/api";
import { Patient } from "../../types";

interface PatientLookupProps {
  onPatientSelect: (patient: Patient) => void;
}

interface FormData {
  phoneNumber: string;
}

const PatientLookup: React.FC<PatientLookupProps> = ({ onPatientSelect }) => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  // Query for patient lookup
  const {
    data: patient,
    isLoading,
    error,
    refetch,
  } = useQuery(
    ["patientLookup", phoneNumber],
    () => (phoneNumber ? patientAPI.lookupByPhone(phoneNumber) : null),
    {
      enabled: false, // Don't run query until search is triggered
      onSuccess: (data) => {
        if (data) {
          onPatientSelect(data);
        }
      },
    }
  );

  const onSubmit = async (data: FormData) => {
    setPhoneNumber(data.phoneNumber);
    refetch();
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Patient Lookup</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="text"
              placeholder="Enter patient's phone number"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              {...register("phoneNumber", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9+\-\s()]+$/,
                  message: "Please enter a valid phone number",
                },
              })}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
          <div className="self-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">
            Error searching for patient. Please try again.
          </p>
        </div>
      )}

      {patient && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md flex justify-between items-center">
          <div>
            <p className="font-medium">Patient found:</p>
            <p>
              {patient.name} • {patient.phoneNumber}
            </p>
          </div>
          <button
            onClick={() => onPatientSelect(patient)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Select
          </button>
        </div>
      )}

      {phoneNumber && !patient && !isLoading && !error && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md flex justify-between items-center">
          <div>
            <p className="font-medium">
              No patient found with this phone number.
            </p>
          </div>
          <button
            onClick={() =>
              (window.location.href = `/patients/new?phoneNumber=${encodeURIComponent(
                phoneNumber
              )}`)
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create New Patient
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientLookup;
