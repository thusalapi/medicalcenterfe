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
  FaHeartbeat,
  FaChartLine,
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

  // Mock trend data - in real app, this would come from API
  const getTrendData = (current: number | undefined, previous: number) => {
    if (!current) return { value: 0, isPositive: true };
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.round(Math.abs(change)),
      isPositive: change >= 0,
    };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Visits */}
      <StatCard
        title="Total Visits"
        value={visitsLoading ? "..." : visitStats?.total || 0}
        description="All patient visits recorded"
        icon={<FaUserInjured />}
        colorClass="bg-gradient-to-br from-medical-primary to-medical-primary-dark"
        trend={getTrendData(visitStats?.total, 120)}
      />
      {/* Today's Visits */}
      <StatCard
        title="Today's Visits"
        value={visitsLoading ? "..." : visitStats?.today || 0}
        description="Visits scheduled for today"
        icon={<FaCalendarCheck />}
        colorClass="bg-gradient-to-br from-medical-secondary to-medical-secondary-dark"
        trend={getTrendData(visitStats?.today, 8)}
      />
      {/* Monthly Revenue */}
      <StatCard
        title="Monthly Revenue"
        value={
          billsLoading ? "..." : formatCurrency(billStats?.monthlyRevenue || 0)
        }
        description="Revenue generated this month"
        icon={<FaMoneyBillWave />}
        colorClass="bg-gradient-to-br from-medical-warning to-yellow-600"
        trend={getTrendData(billStats?.monthlyRevenue, 15000)}
      />{" "}
      {/* Pending Reports */}
      <StatCard
        title="Pending Reports"
        value={reportsLoading ? "..." : reportStats?.pendingReports || 0}
        description="Reports awaiting review"
        icon={<FaFileAlt />}
        colorClass="bg-gradient-to-br from-medical-accent to-red-600"
        trend={getTrendData(reportStats?.pendingReports, 12)}
      />
    </div>
  );
};

export default Dashboard;
