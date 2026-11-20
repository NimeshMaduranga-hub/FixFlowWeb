
import React, { useEffect, useState } from "react";

import {
  getAllRepairJobs,
  type RepairJob
} from "../service/repairJob";

export const Home: React.FC = () => {

  const [repairJobs, setRepairJobs] = useState<RepairJob[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<string>("");

  // Get All Repair Jobs
  useEffect(() => {

    let active = true;

    const fetchRepairJobs = async () => {

      try {

        const response = await getAllRepairJobs();

        if (!active) return;

        setRepairJobs(response.data ?? []);

      } catch (error) {

        console.error("Repair Jobs Error:", error);

        if (active) {
          setError("Failed to load repair jobs.");
        }

      } finally {

        if (active) {
          setLoading(false);
        }

      }
    };

    fetchRepairJobs();

    return () => {
      active = false;
    };

  }, []);

  // Calculate Dashboard Statistics
  const totalJobs = repairJobs.length;

  const pendingJobs = repairJobs.filter(
      (job) => job.status === "Pending"
  ).length;

  const inProgressJobs = repairJobs.filter(
      (job) => job.status === "In Progress"
  ).length;

  const completedJobs = repairJobs.filter(
      (job) => job.status === "Completed"
  ).length;

  // Get Status Style
  const getStatusStyle = (status: RepairJob["status"]) => {

    switch (status) {

      case "Pending":
        return "bg-amber-100 text-amber-700";

      case "In Progress":
        return "bg-blue-100 text-blue-700";

      case "Completed":
        return "bg-green-100 text-green-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  // Get Customer Name
  const getCustomerName = (job: RepairJob) => {

    if (typeof job.customer === "string") {
      return "Customer";
    }

    return job.customer?.name || "Unknown Customer";
  };

  return (

      <div className="space-y-8">

        {/* Welcome Section */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-700 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-sm">

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Welcome to FixFlow
          </h1>

          <p className="text-blue-100 text-sm sm:text-base max-w-xl">
            Manage electronic device repairs, monitor repair progress
            and keep track of your customers.
          </p>

        </div>

        {/* Dashboard Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Total Jobs */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">

            <p className="text-sm text-slate-500 font-medium">
              Total Repair Jobs
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mt-2">
              {totalJobs}
            </h2>

          </div>

          {/* Pending Jobs */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">

            <p className="text-sm text-slate-500 font-medium">
              Pending Jobs
            </p>

            <h2 className="text-3xl font-bold text-amber-600 mt-2">
              {pendingJobs}
            </h2>

          </div>

          {/* In Progress Jobs */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">

            <p className="text-sm text-slate-500 font-medium">
              In Progress
            </p>

            <h2 className="text-3xl font-bold text-blue-600 mt-2">
              {inProgressJobs}
            </h2>

          </div>

          {/* Completed Jobs */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">

            <p className="text-sm text-slate-500 font-medium">
              Completed Jobs
            </p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {completedJobs}
            </h2>

          </div>

        </div>

        {/* Recent Repair Jobs */}
        <div className="space-y-4">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Repair Jobs
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Overview of all registered repair jobs.
            </p>
          </div>

          {/* Loading */}
          {loading && (

              <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center">

                <p className="text-slate-500">
                  Loading repair jobs...
                </p>

              </div>

          )}

          {/* Error */}
          {!loading && error && (

              <div className="bg-red-50 border border-red-200 p-6 rounded-2xl">

                <p className="text-red-600">
                  {error}
                </p>

              </div>

          )}

          {/* Empty Data */}
          {!loading && !error && repairJobs.length === 0 && (

              <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">

                <h3 className="text-lg font-semibold text-slate-800">
                  No Repair Jobs Found
                </h3>

                <p className="text-sm text-slate-500 mt-2">
                  There are currently no repair jobs registered.
                </p>

              </div>

          )}

          {/* Repair Job Cards */}
          {!loading && !error && repairJobs.length > 0 && (

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                {repairJobs.map((job) => (

                    <div
                        key={job._id}
                        className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
                    >

                      <div className="flex items-start justify-between gap-3">

                        <div>

                          <h3 className="font-bold text-slate-900">
                            {job.deviceName}
                          </h3>

                          <p className="text-xs text-slate-500 mt-1">
                            {job.deviceType}
                          </p>

                        </div>

                        <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusStyle(job.status)}`}
                        >
                                        {job.status}
                                    </span>

                      </div>

                      <div className="border-t border-slate-100 my-4"></div>

                      <div className="space-y-3">

                        <div>

                          <p className="text-xs text-slate-400">
                            Customer
                          </p>

                          <p className="text-sm font-medium text-slate-700">
                            {getCustomerName(job)}
                          </p>

                        </div>

                        <div>

                          <p className="text-xs text-slate-400">
                            Problem
                          </p>

                          <p className="text-sm text-slate-700">
                            {job.problem}
                          </p>

                        </div>

                        <div>

                          <p className="text-xs text-slate-400">
                            Technician
                          </p>

                          <p className="text-sm text-slate-700">
                            {job.technician}
                          </p>

                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">

                                        <span className="text-xs text-slate-500">
                                            Estimated Cost
                                        </span>

                          <span className="font-bold text-blue-600">
                                            Rs. {job.estimatedCost.toLocaleString()}
                                        </span>

                        </div>

                      </div>

                    </div>

                ))}

              </div>

          )}

        </div>

      </div>
  );
};
