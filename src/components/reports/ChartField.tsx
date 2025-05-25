import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export interface ChartFieldProps {
  type: "pie" | "bar";
  width?: number;
  height?: number;
  demoData?: boolean; // Whether to use demo data
}

const ChartField: React.FC<ChartFieldProps> = ({
  type = "pie",
  width = 300,
  height = 200,
  demoData = true,
}) => {
  // Demo data for charts
  const pieData = {
    labels: ["Normal", "Abnormal", "Inconclusive"],
    datasets: [
      {
        label: "Test Results",
        data: [65, 25, 10],
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(255, 206, 86, 0.6)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Patient Results",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text:
          type === "pie" ? "Test Results Distribution" : "Monthly Test Results",
      },
    },
  };

  return (
    <div style={{ width, height }}>
      {type === "pie" ? (
        <Pie data={pieData} options={options} />
      ) : (
        <Bar data={barData} options={options} />
      )}
    </div>
  );
};

export default ChartField;
