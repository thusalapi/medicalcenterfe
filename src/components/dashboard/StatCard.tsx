import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  colorClass: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  colorClass,
  trend,
}) => {
  return (
    <div className="card-medical p-6 hover:scale-105 transition-all duration-300 group">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-sm font-medium text-medical-gray-medium mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-medical-gray-dark mb-2 group-hover:text-medical-primary transition-colors duration-200">
            {value}
          </p>
          {description && (
            <p className="text-xs text-medical-gray-medium leading-relaxed">
              {description}
            </p>
          )}
          {trend && (
            <div className="mt-3 flex items-center space-x-1">
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  trend.isPositive
                    ? "text-medical-secondary bg-green-50"
                    : "text-medical-accent bg-red-50"
                }`}
              >
                {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-medical-gray-medium">
                vs last month
              </span>
            </div>
          )}
        </div>
        <div
          className={`rounded-xl p-3 ${colorClass} shadow-lg group-hover:scale-110 transition-all duration-200`}
        >
          <div className="text-white text-xl">{icon}</div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
