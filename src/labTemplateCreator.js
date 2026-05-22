// Lab Template Creator Script
const createLabTemplates = async () => {
    // List of lab tests from user request
    const labTests = [
        "ALK PHOSPATASE",
        "AMYLASE",
        "BILIRUBIN",
        "CHLORIDE",
        "CHOLESTEROL",
        "C.K",
        "CREATININE",
        "ELECTROLYTE",
        "GAMMAGT",
        "FBS",
        "RBS",
        "PPBS",
        "G.T.T.",
        "G.T.T. (NORMAL)",
        "G.T.T. (SPOT)",
        "POTASSIUM",
        "PROTEIN",
        "ACETONE",
        "ALBUMIN",
        "S.G.O.T. (AST)",
        "S.G.P.T. (ALT)"
    ];

    // Templates array to store all the template data
    const templates = [];

    // Create a template for each lab test
    for (let i = 0; i < labTests.length; i++) {
        const labTest = labTests[i];

        // Create template with appropriate fields for each test
        const template = {
            reportName: labTest,
            reportTemplate: {
                paperSize: "A4",
                orientation: "portrait",
                fields: [
                    // Report header with lab test name
                    {
                        id: `field_header_${Date.now()}_${i}`,
                        label: labTest,
                        type: "heading",
                        x: 200,
                        y: 40,
                        fontSize: 18,
                        bold: true,
                        showLabel: true
                    },
                    // Patient details
                    {
                        id: `field_patient_name_${Date.now()}_${i}`,
                        label: "Patient Name",
                        type: "text",
                        x: 50,
                        y: 100,
                        fontSize: 12,
                        bold: false,
                        showLabel: true
                    },
                    {
                        id: `field_patient_id_${Date.now()}_${i}`,
                        label: "Patient ID",
                        type: "text",
                        x: 400,
                        y: 100,
                        fontSize: 12,
                        bold: false,
                        showLabel: true
                    },
                    {
                        id: `field_age_${Date.now()}_${i}`,
                        label: "Age",
                        type: "text",
                        x: 50,
                        y: 140,
                        fontSize: 12,
                        bold: false,
                        showLabel: true
                    },
                    {
                        id: `field_gender_${Date.now()}_${i}`,
                        label: "Gender",
                        type: "text",
                        x: 400,
                        y: 140,
                        fontSize: 12,
                        bold: false,
                        showLabel: true
                    },
                    // Test specific fields
                    {
                        id: `field_result_${Date.now()}_${i}`,
                        label: "Result",
                        type: "text",
                        x: 50,
                        y: 200,
                        fontSize: 12,
                        bold: false,
                        showLabel: true
                    },
                    {
                        id: `field_reference_range_${Date.now()}_${i}`,
                        label: "Reference Range",
                        type: "text",
                        x: 50,
                        y: 240,
                        fontSize: 12,
                        bold: false,
                        showLabel: true
                    },
                    // Add test-specific fields based on the test name
                    ...getAdditionalFieldsForTest(labTest, i),
                    // Date and signature
                    {
                        id: `field_test_date_${Date.now()}_${i}`,
                        label: "Test Date",
                        type: "date",
                        x: 50,
                        y: 320,
                        fontSize: 12,
                        bold: false,
                        showLabel: true
                    },
                    {
                        id: `field_technician_${Date.now()}_${i}`,
                        label: "Lab Technician",
                        type: "text",
                        x: 50,
                        y: 360,
                        fontSize: 12,
                        bold: false,
                        showLabel: true
                    },
                    {
                        id: `field_doctor_${Date.now()}_${i}`,
                        label: "Doctor's Signature",
                        type: "text",
                        x: 400,
                        y: 360,
                        fontSize: 12,
                        bold: false,
                        showLabel: true
                    },
                    {
                        id: `field_notes_${Date.now()}_${i}`,
                        label: "Notes",
                        type: "textarea",
                        x: 50,
                        y: 400,
                        fontSize: 12,
                        bold: false,
                        showLabel: true
                    }
                ]
            }
        };

        templates.push(template);
    }

    return templates;
};

// Helper function to add specific fields for different types of tests
const getAdditionalFieldsForTest = (labTest, index) => {
    const additionalFields = [];
    const now = Date.now();

    if (labTest === "ELECTROLYTE") {
        additionalFields.push(
            {
                id: `field_sodium_${now}_${index}`,
                label: "Sodium",
                type: "text",
                x: 50,
                y: 280,
                fontSize: 12,
                bold: false,
                showLabel: true
            },
            {
                id: `field_potassium_${now}_${index}`,
                label: "Potassium",
                type: "text",
                x: 300,
                y: 280,
                fontSize: 12,
                bold: false,
                showLabel: true
            },
            {
                id: `field_chloride_${now}_${index}`,
                label: "Chloride",
                type: "text",
                x: 50,
                y: 320,
                fontSize: 12,
                bold: false,
                showLabel: true
            },
            {
                id: `field_bicarbonate_${now}_${index}`,
                label: "Bicarbonate",
                type: "text",
                x: 300,
                y: 320,
                fontSize: 12,
                bold: false,
                showLabel: true
            }
        );
    }
    else if (labTest.includes("G.T.T")) {
        additionalFields.push(
            {
                id: `field_fasting_${now}_${index}`,
                label: "Fasting",
                type: "text",
                x: 50,
                y: 280,
                fontSize: 12,
                bold: false,
                showLabel: true
            },
            {
                id: `field_30min_${now}_${index}`,
                label: "30 Minutes",
                type: "text",
                x: 300,
                y: 280,
                fontSize: 12,
                bold: false,
                showLabel: true
            },
            {
                id: `field_60min_${now}_${index}`,
                label: "60 Minutes",
                type: "text",
                x: 50,
                y: 320,
                fontSize: 12,
                bold: false,
                showLabel: true
            },
            {
                id: `field_120min_${now}_${index}`,
                label: "120 Minutes",
                type: "text",
                x: 300,
                y: 320,
                fontSize: 12,
                bold: false,
                showLabel: true
            }
        );
    }
    else if (labTest === "FBS" || labTest === "RBS" || labTest === "PPBS") {
        additionalFields.push(
            {
                id: `field_glucose_level_${now}_${index}`,
                label: "Glucose Level",
                type: "text",
                x: 50,
                y: 280,
                fontSize: 12,
                bold: false,
                showLabel: true
            },
            {
                id: `field_collection_time_${now}_${index}`,
                label: "Collection Time",
                type: "text",
                x: 300,
                y: 280,
                fontSize: 12,
                bold: false,
                showLabel: true
            }
        );
    }

    return additionalFields;
};

// Export the function
export { createLabTemplates };
