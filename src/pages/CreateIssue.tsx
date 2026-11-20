
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createRepairJob,
  type RepairJobStatus
} from "../service/repairJob";

import {
  getAllCustomers,
  type Customer
} from "../service/customer";

export const CreateIssue: React.FC = () => {

  const navigate = useNavigate();

  // Customer State
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [loadingCustomers, setLoadingCustomers] = useState(true);

  // Form States
  const [customerId, setCustomerId] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [deviceType, setDeviceType] = useState("Mobile");
  const [problem, setProblem] = useState("");
  const [technician, setTechnician] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");

  const [status, setStatus] = useState<RepairJobStatus>("Pending");

  const [submitting, setSubmitting] = useState(false);

  // Load Customers
  useEffect(() => {

    let active = true;

    const fetchCustomers = async () => {

      try {

        const response = await getAllCustomers();

        if (active) {
          setCustomers(response.data ?? []);
        }

      } catch (error) {

        console.error("Customer Loading Error:", error);

        if (active) {
          alert("Failed to load customers.");
        }

      } finally {

        if (active) {
          setLoadingCustomers(false);
        }

      }
    };

    fetchCustomers();

    return () => {
      active = false;
    };

  }, []);

  // Submit Repair Job
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    if (!customerId || !deviceName.trim() || !deviceType ||
        !problem.trim() || !technician.trim() || !estimatedCost) {

      return alert("Please fill all fields.");
    }

    const cost = Number(estimatedCost);

    if (!Number.isFinite(cost) || cost < 0) {
      return alert("Please enter a valid estimated cost.");
    }

    setSubmitting(true);

    try {

      await createRepairJob({
        customer: customerId,
        deviceName: deviceName.trim(),
        deviceType,
        problem: problem.trim(),
        technician: technician.trim(),
        status,
        estimatedCost: cost
      });

      alert("Repair Job created successfully!");

      navigate("/");

    } catch (error) {

      console.error("Create Repair Job Error:", error);

      alert("Failed to create repair job.");

    } finally {

      setSubmitting(false);

    }
  };

  return (

      <div className="max-w-4xl mx-auto py-4 px-3 sm:px-6">

        {/* Page Header */}
        <div className="flex items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200">

          <div className="flex items-center gap-3">

            <button
                type="button"
                onClick={() => navigate(-1)}
                className="p-2 text-slate-500 hover:text-slate-900 bg-slate-100 rounded-xl"
            >
              ←
            </button>

            <div>

              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Create Repair Job
              </h1>

              <p className="text-xs text-slate-500 mt-1">
                FixFlow Repair Management System
              </p>

            </div>

          </div>

        </div>

        {/* Repair Job Form */}
        <form
            onSubmit={handleSubmit}
            className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 shadow-sm space-y-6"
        >

          {/* Customer Selection */}
          <div className="space-y-2">

            <label className="block text-sm font-semibold text-slate-700">
              Select Customer
            </label>

            <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                required
                disabled={loadingCustomers || customers.length === 0}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-white disabled:bg-slate-100"
            >

              <option value="">
                {loadingCustomers
                    ? "Loading customers..."
                    : customers.length === 0
                        ? "No customers available"
                        : "Select a customer"}
              </option>

              {customers.map((customer) => (

                  <option key={customer._id} value={customer._id}>
                    {customer.name} - {customer.phone}
                  </option>

              ))}

            </select>

            {!loadingCustomers && customers.length === 0 && (
                <p className="text-xs text-rose-600">
                  Please register a customer before creating a repair job.
                </p>
            )}

          </div>

          {/* Device Name */}
          <div className="space-y-2">

            <label className="block text-sm font-semibold text-slate-700">
              Device Name
            </label>

            <input
                type="text"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                placeholder="Example: Samsung Galaxy A15"
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
            />

          </div>

          {/* Device Type */}
          <div className="space-y-2">

            <label className="block text-sm font-semibold text-slate-700">
              Device Type
            </label>

            <select
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value)}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-white"
            >

              <option value="Mobile">Mobile</option>
              <option value="Laptop">Laptop</option>
              <option value="Tablet">Tablet</option>
              <option value="Desktop">Desktop</option>
              <option value="Other">Other</option>

            </select>

          </div>

          {/* Problem Description */}
          <div className="space-y-2">

            <label className="block text-sm font-semibold text-slate-700">
              Device Problem
            </label>

            <textarea
                rows={4}
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Describe the device problem..."
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 resize-y"
            />

          </div>

          {/* Technician */}
          <div className="space-y-2">

            <label className="block text-sm font-semibold text-slate-700">
              Technician Name
            </label>

            <input
                type="text"
                value={technician}
                onChange={(e) => setTechnician(e.target.value)}
                placeholder="Enter technician name"
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
            />

          </div>

          {/* Estimated Cost */}
          <div className="space-y-2">

            <label className="block text-sm font-semibold text-slate-700">
              Estimated Cost (Rs.)
            </label>

            <input
                type="number"
                min="0"
                step="0.01"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                placeholder="Example: 15000"
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
            />

          </div>

          {/* Repair Status */}
          <div className="space-y-2">

            <label className="block text-sm font-semibold text-slate-700">
              Repair Status
            </label>

            <select
                value={status}
                onChange={(e) => setStatus(e.target.value as RepairJobStatus)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-white"
            >

              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>

            </select>

          </div>

          {/* Form Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-5 border-t border-slate-100">

            <button
                type="button"
                onClick={() => navigate("/")}
                className="px-5 py-3 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Cancel
            </button>

            <button
                type="submit"
                disabled={submitting || loadingCustomers || customers.length === 0}
                className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Repair Job"}
            </button>

          </div>

        </form>

      </div>
  );
};
