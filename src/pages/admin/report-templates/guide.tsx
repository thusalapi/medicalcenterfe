import React from "react";
import Head from "next/head";
import Link from "next/link";
import {
  FaFileAlt,
  FaMousePointer,
  FaSave,
  FaPrint,
  FaDatabase,
  FaArrowRight,
  FaMagic,
  FaEdit,
  FaEye,
} from "react-icons/fa";

const TemplateGuide: React.FC = () => {
  return (
    <>
      <Head>
        <title>Report Template Guide | Medical Center Management System</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Report Template Creation Guide
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn how to create professional medical report templates with
              static content and dynamic database fields
            </p>
          </div>

          {/* Workflow Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaEdit className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                1. Create Static Content
              </h3>
              <p className="text-gray-600 text-sm">
                Add permanent text, headers, titles, and layout elements
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaMousePointer className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                2. Add Dynamic Fields
              </h3>
              <p className="text-gray-600 text-sm">
                Drag and drop database-connected fields for patient data
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaSave className="text-purple-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                3. Save Template
              </h3>
              <p className="text-gray-600 text-sm">
                Save the complete template structure for reuse
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaPrint className="text-orange-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                4. Generate Reports
              </h3>
              <p className="text-gray-600 text-sm">
                Auto-fill data and generate PDF reports for printing
              </p>
            </div>
          </div>

          {/* Detailed Workflow */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Complete Workflow
            </h2>

            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex items-start space-x-4">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Create Static Content
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start by adding permanent content that will appear on every
                    report generated from this template:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li>Medical center name and logo</li>
                    <li>Report title (e.g., "Blood Test Report")</li>
                    <li>
                      Section headers (e.g., "Patient Information", "Test
                      Results")
                    </li>
                    <li>Instructions or disclaimers</li>
                    <li>Static labels and formatting elements</li>
                  </ul>
                  <div className="mt-4 p-4 bg-blue-50 rounded-md">
                    <p className="text-blue-800 text-sm">
                      <strong>Tip:</strong> Use the text tools in the left
                      sidebar to add headings, subheadings, and regular text.
                      Double-click any text element to edit it directly.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start space-x-4">
                <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Add Dynamic Fields
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Drag and drop dynamic fields that will be automatically
                    filled with database data:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-700">
                        Patient Data Fields:
                      </h4>
                      <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-4">
                        <li>Patient Name</li>
                        <li>Patient ID</li>
                        <li>Age & Gender</li>
                        <li>Phone & Address</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700">
                        Medical Data Fields:
                      </h4>
                      <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-4">
                        <li>Test Results</li>
                        <li>Doctor Notes</li>
                        <li>Visit Date</li>
                        <li>Recommendations</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-green-50 rounded-md">
                    <p className="text-green-800 text-sm">
                      <strong>Tip:</strong> Use the "Quick Add Database Fields"
                      section for common medical fields, or drag custom field
                      types from the "Dynamic Fields" section.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start space-x-4">
                <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Save Template Structure
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Once your template design is complete, save it to the
                    database:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li>Enter a descriptive template name</li>
                    <li>Add a description explaining the template's purpose</li>
                    <li>
                      Select the appropriate category (Blood Test, Urine Test,
                      etc.)
                    </li>
                    <li>
                      Click "Save Template" to store the design and field
                      mappings
                    </li>
                  </ul>
                  <div className="mt-4 p-4 bg-purple-50 rounded-md">
                    <p className="text-purple-800 text-sm">
                      <strong>Note:</strong> The template saves both the visual
                      layout and the database field mappings, so reports can be
                      automatically populated with patient data.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start space-x-4">
                <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Generate Reports with Auto-Fill
                  </h3>
                  <p className="text-gray-600 mb-4">
                    When generating reports, the system automatically fills in
                    database data:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li>Select a saved template from the template library</li>
                    <li>Choose a patient and visit (if applicable)</li>
                    <li>
                      Click "Auto-Fill Data" to populate fields from the
                      database
                    </li>
                    <li>
                      Add or modify any test results or additional information
                    </li>
                    <li>Preview the report to check formatting and content</li>
                    <li>Generate PDF for printing or digital sharing</li>
                  </ul>
                  <div className="mt-4 p-4 bg-orange-50 rounded-md">
                    <p className="text-orange-800 text-sm">
                      <strong>Auto-Fill Magic:</strong> Patient information,
                      visit details, and even current date are automatically
                      filled based on the selected patient and visit data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Blood Test Example */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Example: Blood Test Report Template
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Static Content Includes:
                </h3>
                <div className="bg-gray-50 p-4 rounded-md space-y-2">
                  <div className="text-center font-bold text-lg">
                    MEDICAL CENTER LABORATORY
                  </div>
                  <div className="text-center font-semibold">
                    BLOOD TEST REPORT
                  </div>
                  <div className="mt-4 font-semibold">PATIENT INFORMATION</div>
                  <div className="mt-4 font-semibold">TEST RESULTS</div>
                  <div className="text-sm text-gray-600 mt-4">
                    Normal ranges and reference values would be listed here...
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Dynamic Fields Include:
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <FaDatabase className="text-blue-600" />
                    <span className="text-gray-700">Patient Name → </span>
                    <span className="bg-green-100 px-2 py-1 rounded text-green-800 text-sm">
                      John Doe
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaDatabase className="text-blue-600" />
                    <span className="text-gray-700">Patient ID → </span>
                    <span className="bg-green-100 px-2 py-1 rounded text-green-800 text-sm">
                      P001234
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaDatabase className="text-blue-600" />
                    <span className="text-gray-700">Hemoglobin → </span>
                    <span className="bg-yellow-100 px-2 py-1 rounded text-yellow-800 text-sm">
                      14.5 g/dL
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaDatabase className="text-blue-600" />
                    <span className="text-gray-700">WBC Count → </span>
                    <span className="bg-yellow-100 px-2 py-1 rounded text-yellow-800 text-sm">
                      7,200 /μL
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaDatabase className="text-blue-600" />
                    <span className="text-gray-700">Test Date → </span>
                    <span className="bg-blue-100 px-2 py-1 rounded text-blue-800 text-sm">
                      Auto-filled
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Benefits of This System</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <FaMagic className="text-3xl mb-4 mx-auto" />
                <h3 className="font-semibold mb-2">Time Saving</h3>
                <p className="text-sm opacity-90">
                  Auto-fill patient data instantly from database records
                </p>
              </div>
              <div className="text-center">
                <FaFileAlt className="text-3xl mb-4 mx-auto" />
                <h3 className="font-semibold mb-2">Consistency</h3>
                <p className="text-sm opacity-90">
                  Standardized report formats across all medical staff
                </p>
              </div>
              <div className="text-center">
                <FaEye className="text-3xl mb-4 mx-auto" />
                <h3 className="font-semibold mb-2">Professional</h3>
                <p className="text-sm opacity-90">
                  Clean, professional reports ready for printing
                </p>
              </div>
            </div>
          </div>

          {/* Get Started */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-600 mb-6">
              Create your first medical report template using our drag-and-drop
              designer
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/admin/report-templates/designer">
                <a className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition">
                  Create New Template
                </a>
              </Link>
              <Link href="/reports/template-based">
                <a className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md transition">
                  Generate Report
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TemplateGuide;
