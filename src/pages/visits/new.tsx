import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";
import { visitAPI, patientAPI } from "../../utils/api";
import PatientLookup from "../../components/patients/PatientLookup";
import { Patient } from "../../types";

const NewVisitPage: React.FC = () => {
  const router = useRouter();
  const { patientId } = router.query;
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Check if patientId is in the URL and fetch patient details
  useEffect(() => {
    if (patientId && !isNaN(Number(patientId))) {
      patientAPI
        .getPatientById(Number(patientId))
        .then((data) => {
          setSelectedPatient(data);
        })
        .catch((err) => {
          console.error("Error fetching patient:", err);
          setError("Failed to fetch patient information");
        });
    }
  }, [patientId]);

  // Visit creation mutation
  const createVisitMutation = useMutation(
    (visitData: any) => visitAPI.createVisit(visitData),
    {
      onSuccess: (data) => {
        setSuccess(true);
        setError(null);

        // Redirect to the visit details page after a short delay
        setTimeout(() => {
          router.push(`/visits/${data.visitId}`);
        }, 1500);
      },
      onError: (err: any) => {
        setError(
          err.response?.data?.message ||
            "Failed to create visit. Please try again."
        );
        setSuccess(false);
      },
    }
  );

  // Handle patient selection
  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPatient) {
      setError("Please select a patient first");
      return;
    }

    const visitData = {
      patientId: selectedPatient.patientId,
      visitDate: new Date().toISOString(),
      notes: notes,
    };

    createVisitMutation.mutate(visitData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Visit</h1>
        <p className="text-gray-600">Register a new patient visit</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <p className="text-green-800">
            Visit created successfully! Redirecting...
          </p>
        </div>
      )}

      {!selectedPatient ? (
        <PatientLookup onPatientSelect={handlePatientSelect} />
      ) : (
        <div className="mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Selected Patient</h2>
                <p className="text-lg">{selectedPatient.name}</p>
                <p className="text-gray-600">{selectedPatient.phoneNumber}</p>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                Change Patient
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Visit Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter any notes about this visit"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  disabled={createVisitMutation.isLoading}
                >
                  {createVisitMutation.isLoading ? (
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
                      Creating Visit...
                    </span>
                  ) : (
                    "Create Visit"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewVisitPage;
