
import React, { useEffect, useState } from "react";

import {
  getAllCustomers,
  type Customer
} from "../service/customer";

import {
  getAllRepairJobs,
  type RepairJob
} from "../service/repairJob";

// Statistics Card Props
interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  color: string;
}

// Statistics Card Component
// IMPORTANT: This component is outside AdminDashboard.
const StatCard: React.FC<StatCardProps> = ({
                                             title,
                                             value,
                                             description,
                                             color
                                           }) => {

  return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        <h2 className={`text-3xl font-bold mt-3 ${color}`}>
          {value}
        </h2>

        <p className="text-xs text-slate-400 mt-2">
          {description}
        </p>

      </div>
  );
};

// Admin Dashboard Component
export const AdminDashboard: React.FC = () => {

  const [customers, setCustomers] = useState<Customer[]>([]);

  const [repairJobs, setRepairJobs] = useState<RepairJob[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // Fetch Dashboard Data
  useEffect(() => {

    let active = true;

    const fetchDashboardData = async () => {

      try {

        const [customerResponse, repairJobResponse] =
            await Promise.all([
              getAllCustomers(),
              getAllRepairJobs()
            ]);

        if (!active) return;

        setCustomers(customerResponse.data ?? []);

        setRepairJobs(repairJobResponse.data ?? []);

      } catch (error) {

        console.error("Dashboard Loading Error:", error);

        if (active) {
          setError("Failed to load dashboard data.");
        }

      } finally {

        if (active) {
          setLoading(false);
        }

      }
    };

    fetchDashboardData();

    return () => {
      active = false;
    };

  }, []);

  // Calculate Statistics
  const totalCustomers = customers.length;

  const totalRepairJobs = repairJobs.length;

  const pendingJobs = repairJobs.filter(
      (job) => job.status === "Pending"
  ).length;

  const inProgressJobs = repairJobs.filter(
      (job) => job.status === "In Progress"
  ).length;

  const completedJobs = repairJobs.filter(
      (job) => job.status === "Completed"
  ).length;

  const totalEstimatedValue = repairJobs.reduce(
      (total, job) => total + job.estimatedCost,
      0
  );

  // Calculate Progress Width
  const getProgressWidth = (count: number) => {

    if (totalRepairJobs === 0) {
      return "0%";
    }

    return `${(count / totalRepairJobs) * 100}%`;
  };

  return (

      <div className="space-y-8">

        {/* Dashboard Header */}
        <div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Admin Dashboard
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Monitor customers, repair jobs and system performance.
          </p>

        </div>

        {/* Loading */}
        {loading && (

            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">

              <p className="text-sm text-slate-500">
                Loading dashboard analytics...
              </p>

            </div>

        )}

        {/* Error */}
        {!loading && error && (

            <div className="bg-red-50 border border-red-200 rounded-2xl p-5">

              <p className="text-sm text-red-600">
                {error}
              </p>

            </div>

        )}

        {/* Dashboard Content */}
        {!loading && !error && (

            <>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

                <StatCard
                    title="Total Customers"
                    value={totalCustomers}
                    description="Registered customers"
                    color="text-blue-600"
                />

                <StatCard
                    title="Total Repair Jobs"
                    value={totalRepairJobs}
                    description="All registered repair jobs"
                    color="text-indigo-600"
                />

                <StatCard
                    title="Pending Repairs"
                    value={pendingJobs}
                    description="Jobs waiting for repair"
                    color="text-amber-600"
                />

                <StatCard
                    title="In Progress"
                    value={inProgressJobs}
                    description="Currently being repaired"
                    color="text-blue-600"
                />

                <StatCard
                    title="Completed Repairs"
                    value={completedJobs}
                    description="Successfully completed jobs"
                    color="text-green-600"
                />

                <StatCard
                    title="Estimated Repair Value"
                    value={`Rs. ${totalEstimatedValue.toLocaleString()}`}
                    description="Combined estimated repair cost"
                    color="text-purple-600"
                />

              </div>

              {/* Repair Status Analytics */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

                <div className="mb-6">

                  <h2 className="text-lg font-bold text-slate-900">
                    Repair Status Overview
                  </h2>

                  <p className="text-xs text-slate-500 mt-1">
                    Current distribution of repair jobs.
                  </p>

                </div>

                <div className="space-y-6">

                  {/* Pending */}
                  <div>

                    <div className="flex justify-between items-center mb-2">

                                    <span className="text-sm font-medium text-slate-700">
                                        Pending
                                    </span>

                      <span className="text-sm font-bold text-amber-600">
                                        {pendingJobs}
                                    </span>

                    </div>

                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">

                      <div
                          className="h-full bg-amber-500 rounded-full transition-all"
                          style={{
                            width: getProgressWidth(pendingJobs)
                          }}
                      />

                    </div>

                  </div>

                  {/* In Progress */}
                  <div>

                    <div className="flex justify-between items-center mb-2">

                                    <span className="text-sm font-medium text-slate-700">
                                        In Progress
                                    </span>

                      <span className="text-sm font-bold text-blue-600">
                                        {inProgressJobs}
                                    </span>

                    </div>

                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">

                      <div
                          className="h-full bg-blue-500 rounded-full transition-all"
                          style={{
                            width: getProgressWidth(inProgressJobs)
                          }}
                      />

                    </div>

                  </div>

                  {/* Completed */}
                  <div>

                    <div className="flex justify-between items-center mb-2">

                                    <span className="text-sm font-medium text-slate-700">
                                        Completed
                                    </span>

                      <span className="text-sm font-bold text-green-600">
                                        {completedJobs}
                                    </span>

                    </div>

                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">

                      <div
                          className="h-full bg-green-500 rounded-full transition-all"
                          style={{
                            width: getProgressWidth(completedJobs)
                          }}
                      />

                    </div>

                  </div>

                </div>

              </div>

              {/* Recent Repair Jobs */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

                <div className="mb-5">

                  <h2 className="text-lg font-bold text-slate-900">
                    Recent Repair Jobs
                  </h2>

                  <p className="text-xs text-slate-500 mt-1">
                    Latest registered repair jobs.
                  </p>

                </div>

                {repairJobs.length === 0 ? (

                    <div className="text-center py-10">

                      <p className="text-sm text-slate-500">
                        No repair jobs available.
                      </p>

                    </div>

                ) : (

                    <div className="space-y-3">

                      {[...repairJobs]
                          .sort((a, b) =>
                              new Date(b.createdAt ?? 0).getTime() -
                              new Date(a.createdAt ?? 0).getTime()
                          )
                          .slice(0, 5)
                          .map((job) => (

                              <div
                                  key={job._id}
                                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl"
                              >

                                <div>

                                  <h3 className="text-sm font-semibold text-slate-900">
                                    {job.deviceName}
                                  </h3>

                                  <p className="text-xs text-slate-500 mt-1">
                                    Technician: {job.technician}
                                  </p>

                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-4">

                                                <span className="text-sm font-bold text-blue-600">
                                                    Rs. {job.estimatedCost.toLocaleString()}
                                                </span>

                                  <span
                                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                          job.status === "Pending"
                                              ? "bg-amber-100 text-amber-700"
                                              : job.status === "In Progress"
                                                  ? "bg-blue-100 text-blue-700"
                                                  : "bg-green-100 text-green-700"
                                      }`}
                                  >
                                                    {job.status}
                                                </span>

                                </div>

                              </div>

                          ))}

                    </div>

                )}

              </div>

            </>

        )}

      </div>
  );
};
