import React, { useState } from "react";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { patientAPI } from "../../utils/api";
import { CreatePatientRequest } from "../../types";
import PatientForm from "../../components/patients/PatientForm";

const NewPatientPage: React.FC = () => {
  const router = useRouter();
  const { phoneNumber } = router.query;
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // React Query mutation for creating a patient
  const createPatientMutation = useMutation(
    (patientData: CreatePatientRequest) =>
      patientAPI.createPatient(patientData),
    {
      onSuccess: (data) => {
        setSuccess(true);
        setError(null);

        // Redirect to patient details after a short delay
        setTimeout(() => {
          router.push(`/patients/${data.patientId}`);
        }, 1500);
      },
      onError: (error: any) => {
        setError(
          error.response?.data?.message ||
            "Failed to register patient. Please try again."
        );
        setSuccess(false);
      },
    }
  );

  // Handle form submission
  const handleSubmit = async (data: CreatePatientRequest) => {
    // If phoneNumber was provided in query params, use it
    if (phoneNumber && typeof phoneNumber === "string") {
      data.phoneNumber = phoneNumber;
    }

    await createPatientMutation.mutate(data);
  };

  // Define custom fields for the patient form
  const customFields = {
    email: { label: "Email", type: "email", required: false },
    address: { label: "Address", type: "textarea", required: false },
    dateOfBirth: { label: "Date of Birth", type: "date", required: false },
    gender: { label: "Gender", type: "select", required: false },
    bloodGroup: { label: "Blood Group", type: "select", required: false },
    allergies: { label: "Allergies", type: "textarea", required: false },
    emergencyContact: {
      label: "Emergency Contact",
      type: "text",
      required: false,
    },
    notes: { label: "Notes", type: "textarea", required: false },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Patient Registration</h1>
        <p className="text-gray-600">Register a new patient in the system</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <p className="text-green-800">
            Patient registered successfully! Redirecting...
          </p>
        </div>
      )}

      <PatientForm
        onSubmit={handleSubmit}
        isEdit={false}
        customFields={customFields}
        initialData={
          phoneNumber
            ? ({ phoneNumber: phoneNumber as string } as any)
            : undefined
        }
      />
    </div>
  );
};

export default NewPatientPage;
