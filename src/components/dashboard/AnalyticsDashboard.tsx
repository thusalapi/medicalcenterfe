import React from "react";
import { useQuery } from "react-query";
import { statisticsAPI } from "../../utils/statisticsAPI";
import {
  FaCalendarAlt,
  FaUsers,
  FaFileAlt,
  FaMoneyBillAlt,
} from "react-icons/fa";
import StatCard from "./StatCard";

/**
 * Analytics Dashboard Component that displays key statistics for the medical center
 */
const AnalyticsDashboard: React.FC = () => {
  // Fetch comprehensive statistics for dashboard
  const { data: stats, isLoading } = useQuery(
    "dashboardStats",
    statisticsAPI.getDashboardStats,
    {
      refetchInterval: 60000, // Refresh every minute
    }
  );

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
      <StatCard
        title="Today's Visits"
        value={isLoading ? "..." : stats?.visitsToday || 0}
        description="Patient visits today"
        icon={<FaCalendarAlt className="text-white text-lg" />}
        colorClass="bg-green-500"
      />

      <StatCard
        title="Total Patients"
        value={isLoading ? "..." : stats?.totalVisits || 0}
        description="All registered patients"
        icon={<FaUsers className="text-white text-lg" />}
        colorClass="bg-blue-500"
      />

      <StatCard
        title="Today's Revenue"
        value={isLoading ? "..." : formatCurrency(stats?.todayRevenue)}
        description="Revenue generated today"
        icon={<FaMoneyBillAlt className="text-white text-lg" />}
        colorClass="bg-yellow-500"
      />

      <StatCard
        title="Reports"
        value={isLoading ? "..." : stats?.totalReports || 0}
        description={`${
          isLoading ? "..." : stats?.pendingReports || 0
        } pending reports`}
        icon={<FaFileAlt className="text-white text-lg" />}
        colorClass="bg-purple-500"
      />
    </div>
  );
};

export default AnalyticsDashboard;
