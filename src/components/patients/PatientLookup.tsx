import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { patientAPI } from "../../utils/api";
import { Patient } from "../../types";
import {
  FaSearch,
  FaUser,
  FaPhone,
  FaPlus,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

interface PatientLookupProps {
  onPatientSelect: (patient: Patient) => void;
}

interface FormData {
  phoneNumber: string;
}

const PatientLookup: React.FC<PatientLookupProps> = ({ onPatientSelect }) => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [searchAttempted, setSearchAttempted] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const {
    data: patient,
    isLoading,
    error,
  } = useQuery(
    ["patientLookup", phoneNumber],
    () => patientAPI.lookupByPhone(phoneNumber),
    {
      enabled: !!phoneNumber,
      onSuccess: (data) => {
        if (data) {
          onPatientSelect(data);
        }
      },
      onError: (err) => {
        console.error("Patient lookup failed:", err);
      },
      retry: 1,
    }
  );

  const onSubmit = (data: FormData) => {
    setPhoneNumber(data.phoneNumber);
    setSearchAttempted(true);
  };

  useEffect(() => {
    if (phoneNumber) {
      console.log("Phone number state updated:", phoneNumber);
    }
  }, [phoneNumber]);

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow">
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-medical-gray-dark mb-2"
            >
              Patient Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPhone className="h-4 w-4 text-medical-gray-medium" />
              </div>
              <input
                id="phoneNumber"
                type="text"
                placeholder="Enter patient's phone number"
                className="input-medical pl-10 w-full"
                {...register("phoneNumber", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9+\-\s()]+$/,
                    message: "Please enter a valid phone number",
                  },
                })}
              />
            </div>
            {errors.phoneNumber && (
              <p className="mt-2 text-sm text-medical-accent flex items-center">
                <FaExclamationTriangle className="h-4 w-4 mr-1" />
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
          <div className="self-end">
            <button
              type="submit"
              className="btn-medical-primary min-w-[120px] flex items-center justify-center space-x-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner !h-4 !w-4 !border-white"></div>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <FaSearch className="h-4 w-4" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Error State */}
      {error && (
        <div className="status-critical p-4 rounded-medical fade-in">
          <div className="flex items-start space-x-3">
            <FaExclamationTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-800">
                Error searching for patient
              </p>
              <p className="text-sm text-red-700 mt-1">
                {(error as any)?.response?.status === 404
                  ? "No patient found with this phone number."
                  : (error as any)?.message || "Please try again."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Patient Found */}
      {patient && (
        <div className="status-healthy p-6 rounded-medical border-l-4 border-medical-secondary fade-in">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-medical-secondary/10 flex items-center justify-center">
                  <FaUser className="h-6 w-6 text-medical-secondary" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <FaCheckCircle className="h-5 w-5 text-medical-secondary" />
                  <span className="font-medium text-medical-secondary">
                    Patient Found
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-medical-gray-dark">
                  {patient.name}
                </h3>
                <div className="flex items-center space-x-2 text-medical-gray-medium">
                  <FaPhone className="h-4 w-4" />
                  <span>{patient.phoneNumber}</span>
                </div>
                <p className="text-sm text-medical-gray-medium mt-1">
                  Patient ID: {patient.patientId}
                </p>
              </div>
            </div>
            <button
              onClick={() => onPatientSelect(patient)}
              className="btn-medical-secondary flex items-center space-x-2 self-start"
            >
              <FaCheckCircle className="h-4 w-4" />
              <span>Select Patient</span>
            </button>
          </div>
        </div>
      )}

      {/* No Patient Found */}
      {phoneNumber && searchAttempted && !patient && !isLoading && !error && (
        <div className="status-warning p-6 rounded-medical border-l-4 border-medical-warning fade-in">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <FaExclamationTriangle className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">
                  No Patient Found
                </span>
              </div>
              <p className="text-yellow-700">
                No patient found with phone number:{" "}
                <strong>{phoneNumber}</strong>
              </p>
              <p className="text-sm text-yellow-600 mt-1">
                Would you like to create a new patient record?
              </p>
            </div>
            <button
              onClick={() =>
                (window.location.href = `/patients/new?phoneNumber=${encodeURIComponent(
                  phoneNumber
                )}`)
              }
              className="btn-medical-primary flex items-center space-x-2 self-start"
            >
              <FaPlus className="h-4 w-4" />
              <span>Create New Patient</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientLookup;
