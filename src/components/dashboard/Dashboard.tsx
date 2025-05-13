import React from "react";
import { useQuery } from "react-query";
import { billAPI, visitAPI, reportAPI } from "../../utils/api";
import StatCard from "./StatCard";

// Import icons
import {
  FaUserInjured,
  FaMoneyBillWave,
  FaFileAlt,
  FaCalendarCheck,
} from "react-icons/fa";

const Dashboard: React.FC = () => {
  // Fetch statistical data for dashboard
  const { data: visitStats, isLoading: visitsLoading } = useQuery(
    "visitStats",
    () => visitAPI.getVisitStats(),
    { refetchInterval: 60000 } // Refresh every minute
  );

  const { data: billStats, isLoading: billsLoading } = useQuery(
    "billStats",
    () => billAPI.getBillingStats(),
    { refetchInterval: 60000 }
  );

  const { data: reportStats, isLoading: reportsLoading } = useQuery(
    "reportStats",
    () => reportAPI.getReportStats(),
    { refetchInterval: 60000 }
  );

  // Format currency
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Visits */}
      <StatCard
        title="Total Visits"
        value={visitsLoading ? "..." : visitStats?.total || 0}
        description="All patient visits"
        icon={<FaUserInjured className="text-white text-lg" />}
        colorClass="bg-blue-500"
      />

      {/* Today's Visits */}
      <StatCard
        title="Today's Visits"
        value={visitsLoading ? "..." : visitStats?.today || 0}
        description="New patients today"
        icon={<FaCalendarCheck className="text-white text-lg" />}
        colorClass="bg-green-500"
      />

      {/* Revenue */}
      <StatCard
        title="Total Revenue"
        value={billsLoading ? "..." : formatCurrency(billStats?.totalRevenue)}
        description="Overall earnings"
        icon={<FaMoneyBillWave className="text-white text-lg" />}
        colorClass="bg-yellow-500"
      />

      {/* Reports */}
      <StatCard
        title="Total Reports"
        value={reportsLoading ? "..." : reportStats?.total || 0}
        description={`${reportStats?.pendingReports || 0} pending reports`}
        icon={<FaFileAlt className="text-white text-lg" />}
        colorClass="bg-purple-500"
      />
    </div>
  );
};

export default Dashboard;
