import React from "react";
import { FaHeartbeat } from "react-icons/fa";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  message = "Loading...",
  className = "",
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const containerClasses = {
    sm: "p-2",
    md: "p-4",
    lg: "p-8",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center ${containerClasses[size]} ${className}`}
    >
      <div className="relative">
        {/* Outer spinning ring */}
        <div
          className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-medical-primary/20 border-t-medical-primary`}
        ></div>

        {/* Inner heartbeat icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <FaHeartbeat
            className={`${
              size === "sm" ? "h-2 w-2" : size === "md" ? "h-3 w-3" : "h-4 w-4"
            } text-medical-primary animate-pulse-medical`}
          />
        </div>
      </div>

      {message && (
        <p
          className={`mt-3 text-medical-gray-medium ${
            size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"
          } font-medium`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
