import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Patient,
  CreatePatientRequest,
  UpdatePatientRequest,
} from "../../types";

interface PatientFormProps {
  initialData?: Patient;
  onSubmit: (
    data: CreatePatientRequest | UpdatePatientRequest
  ) => Promise<void>;
  isEdit?: boolean;
  customFields?: {
    [key: string]: { label: string; type: string; required?: boolean };
  };
}

const PatientForm: React.FC<PatientFormProps> = ({
  initialData,
  onSubmit,
  isEdit = false,
  customFields = {
    email: { label: "Email", type: "email", required: false },
    address: { label: "Address", type: "textarea", required: false },
    dateOfBirth: { label: "Date of Birth", type: "date", required: false },
    gender: { label: "Gender", type: "select", required: false },
    bloodGroup: { label: "Blood Group", type: "select", required: false },
  },
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customFieldValues, setCustomFieldValues] = useState<any>(
    initialData?.otherDetails || {}
  );

  // Set form values when initial data changes
  useEffect(() => {
    if (initialData) {
      setValue("name", initialData.name);
      setValue("phoneNumber", initialData.phoneNumber);

      // Set custom field values
      if (initialData.otherDetails) {
        Object.entries(initialData.otherDetails).forEach(([key, value]) => {
          setCustomFieldValues((prev) => ({ ...prev, [key]: value }));
        });
      }
    }
  }, [initialData, setValue]);

  // Handle custom field changes
  const handleCustomFieldChange = (field: string, value: any) => {
    setCustomFieldValues({
      ...customFieldValues,
      [field]: value,
    });
  };

  // Handle form submission
  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      // Combine base data with custom fields
      const patientData = {
        ...data,
        otherDetails: customFieldValues,
      };

      await onSubmit(patientData);
    } catch (error) {
      console.error("Error submitting patient data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render input based on field type
  const renderCustomField = (
    fieldName: string,
    fieldConfig: { label: string; type: string; required?: boolean }
  ) => {
    const value = customFieldValues[fieldName] || "";

    switch (fieldConfig.type) {
      case "text":
      case "email":
        return (
          <input
            type={fieldConfig.type}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={value}
            onChange={(e) => handleCustomFieldChange(fieldName, e.target.value)}
            required={fieldConfig.required}
          />
        );

      case "number":
        return (
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={value}
            onChange={(e) => handleCustomFieldChange(fieldName, e.target.value)}
            required={fieldConfig.required}
          />
        );

      case "date":
        return (
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={value}
            onChange={(e) => handleCustomFieldChange(fieldName, e.target.value)}
            required={fieldConfig.required}
          />
        );

      case "textarea":
        return (
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={value}
            onChange={(e) => handleCustomFieldChange(fieldName, e.target.value)}
            required={fieldConfig.required}
            rows={3}
          />
        );

      case "select":
        let options: string[] = [];

        if (fieldName === "gender") {
          options = ["Male", "Female", "Other", "Prefer not to say"];
        } else if (fieldName === "bloodGroup") {
          options = [
            "A+",
            "A-",
            "B+",
            "B-",
            "AB+",
            "AB-",
            "O+",
            "O-",
            "Unknown",
          ];
        }

        return (
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={value}
            onChange={(e) => handleCustomFieldChange(fieldName, e.target.value)}
            required={fieldConfig.required}
          >
            <option value="">Select {fieldConfig.label}</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={value}
            onChange={(e) => handleCustomFieldChange(fieldName, e.target.value)}
            required={fieldConfig.required}
          />
        );
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">
        {isEdit ? "Update Patient" : "New Patient Registration"}
      </h2>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {/* Required Patient Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name<span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("name", {
                required: "Name is required",
                minLength: { value: 2, message: "Name is too short" },
              })}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">
                {errors.name.message as string}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number<span className="text-red-500">*</span>
            </label>
            <input
              id="phoneNumber"
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("phoneNumber", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9+\-\s()]+$/,
                  message: "Please enter a valid phone number",
                },
              })}
              disabled={isEdit} // Cannot edit phone number in edit mode as it's a lookup field
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phoneNumber.message as string}
              </p>
            )}
          </div>
        </div>

        {/* Custom Patient Fields */}
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Additional Patient Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(customFields).map(([fieldName, fieldConfig]) => (
              <div key={fieldName}>
                <label
                  htmlFor={fieldName}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {fieldConfig.label}
                  {fieldConfig.required && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                {renderCustomField(fieldName, fieldConfig)}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
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
                Processing...
              </span>
            ) : isEdit ? (
              "Update Patient"
            ) : (
              "Register Patient"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;
