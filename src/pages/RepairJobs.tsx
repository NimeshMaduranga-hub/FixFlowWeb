
import React, { useEffect, useState } from "react";

import {
    getAllRepairJobs,
    updateRepairJob,
    deleteRepairJob,
    type RepairJob
} from "../service/repairJob";

import {
    getAllCustomers,
    type Customer
} from "../service/customer";

import { useAuth } from "../hooks/useAuth";

export const RepairJobs: React.FC = () => {
    const { user } = useAuth();

    const [repairJobs, setRepairJobs] = useState<RepairJob[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [editingJob, setEditingJob] = useState<RepairJob | null>(null);

    const [formData, setFormData] = useState({
        customer: "",
        deviceName: "",
        deviceType: "",
        problem: "",
        technician: "",
        status: "Pending" as RepairJob["status"],
        estimatedCost: 0
    });

    // Load Repair Jobs
    useEffect(() => {
        let active = true;

        const loadRepairJobs = async () => {
            try {
                const response = await getAllRepairJobs();

                if (active) {
                    setRepairJobs(response.data ?? []);
                }
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

        loadRepairJobs();

        return () => {
            active = false;
        };
    }, []);

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

    // Open Edit Form
    const handleEdit = async (job: RepairJob) => {
        try {
            const response = await getAllCustomers();

            setCustomers(response.data ?? []);

            const customerId =
                typeof job.customer === "string"
                    ? job.customer
                    : job.customer._id;

            setFormData({
                customer: customerId,
                deviceName: job.deviceName,
                deviceType: job.deviceType,
                problem: job.problem,
                technician: job.technician,
                status: job.status,
                estimatedCost: job.estimatedCost
            });

            setEditingJob(job);
            setError("");
        } catch (error) {
            console.error("Customer Loading Error:", error);
            setError("Failed to load customers for editing.");
        }
    };

    // Handle Form Input Changes
    const handleChange = (
        event: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]:
                name === "estimatedCost"
                    ? Number(value)
                    : value
        }));
    };

    // Update Repair Job
    const handleUpdate = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!editingJob) return;

        try {
            setSaving(true);
            setError("");

            await updateRepairJob(editingJob._id, formData);

            const response = await getAllRepairJobs();

            setRepairJobs(response.data ?? []);
            setEditingJob(null);

        } catch (error) {
            console.error("Repair Job Update Error:", error);
            setError("Failed to update repair job. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    // Delete Repair Job
    const handleDelete = async (id: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this repair job?"
        );

        if (!confirmed) return;

        try {
            setError("");

            await deleteRepairJob(id);

            setRepairJobs((previous) =>
                previous.filter((job) => job._id !== id)
            );

        } catch (error) {
            console.error("Repair Job Delete Error:", error);
            setError("Failed to delete repair job. Please try again.");
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Repair Jobs
                    </h1>

                    <p className="text-sm text-slate-500 mt-1">
                        View and monitor all electronic device repair jobs.
                    </p>
                </div>

                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl">
                    <span className="text-sm font-semibold">
                        Total Jobs: {repairJobs.length}
                    </span>
                </div>

            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* Edit Form */}
            {editingJob && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6">

                    <h2 className="text-lg font-bold text-slate-900 mb-5">
                        Edit Repair Job
                    </h2>

                    <form onSubmit={handleUpdate} className="space-y-4">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Customer
                                </label>

                                <select
                                    name="customer"
                                    value={formData.customer}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                                >
                                    <option value="">Select Customer</option>

                                    {customers.map((customer) => (
                                        <option
                                            key={customer._id}
                                            value={customer._id}
                                        >
                                            {customer.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Device Name
                                </label>

                                <input
                                    type="text"
                                    name="deviceName"
                                    value={formData.deviceName}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Device Type
                                </label>

                                <input
                                    type="text"
                                    name="deviceType"
                                    value={formData.deviceType}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Technician
                                </label>

                                <input
                                    type="text"
                                    name="technician"
                                    value={formData.technician}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Estimated Cost (Rs.)
                                </label>

                                <input
                                    type="number"
                                    name="estimatedCost"
                                    value={formData.estimatedCost}
                                    onChange={handleChange}
                                    min="0"
                                    required
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                                />
                            </div>

                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Problem Description
                            </label>

                            <textarea
                                name="problem"
                                value={formData.problem}
                                onChange={handleChange}
                                required
                                rows={3}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                            />
                        </div>

                        <div className="flex gap-3">

                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg disabled:opacity-50"
                            >
                                {saving ? "Updating..." : "Update Repair Job"}
                            </button>

                            <button
                                type="button"
                                onClick={() => setEditingJob(null)}
                                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-5 py-2 rounded-lg"
                            >
                                Cancel
                            </button>

                        </div>

                    </form>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
                    <p className="text-sm text-slate-500">
                        Loading repair jobs...
                    </p>
                </div>
            )}

            {/* Empty Data */}
            {!loading && !error && repairJobs.length === 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
                    <h2 className="text-lg font-semibold text-slate-800">
                        No Repair Jobs Found
                    </h2>

                    <p className="text-sm text-slate-500 mt-2">
                        There are currently no repair jobs registered.
                    </p>
                </div>
            )}

            {/* Repair Jobs List */}
            {!loading && repairJobs.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

                    {/* Table Header */}
                    <div className={`hidden lg:grid ${user?.role === "Admin" ? "lg:grid-cols-8" : "lg:grid-cols-7"} gap-4 p-4 bg-slate-50 border-b border-slate-200`}>

                        <p className="text-xs font-bold text-slate-500 uppercase">Device</p>
                        <p className="text-xs font-bold text-slate-500 uppercase">Customer</p>
                        <p className="text-xs font-bold text-slate-500 uppercase">Type</p>
                        <p className="text-xs font-bold text-slate-500 uppercase">Technician</p>
                        <p className="text-xs font-bold text-slate-500 uppercase">Status</p>
                        <p className="text-xs font-bold text-slate-500 uppercase">Cost</p>
                        <p className="text-xs font-bold text-slate-500 uppercase">Problem</p>

                        {user?.role === "Admin" && (
                            <p className="text-xs font-bold text-slate-500 uppercase">
                                Actions
                            </p>
                        )}

                    </div>

                    {/* Repair Job Records */}
                    <div className="divide-y divide-slate-100">

                        {repairJobs.map((job) => (

                            <div
                                key={job._id}
                                className={`grid grid-cols-1 ${user?.role === "Admin" ? "lg:grid-cols-8" : "lg:grid-cols-7"} gap-3 lg:gap-4 p-5 hover:bg-slate-50 transition`}
                            >

                                <div>
                                    <p className="text-xs text-slate-400 lg:hidden mb-1">Device</p>
                                    <p className="font-semibold text-sm text-slate-900">
                                        {job.deviceName}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-400 lg:hidden mb-1">Customer</p>
                                    <p className="text-sm text-slate-600">
                                        {getCustomerName(job)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-400 lg:hidden mb-1">Device Type</p>
                                    <p className="text-sm text-slate-600">
                                        {job.deviceType}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-400 lg:hidden mb-1">Technician</p>
                                    <p className="text-sm text-slate-600">
                                        {job.technician}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-400 lg:hidden mb-1">Status</p>
                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(job.status)}`}>
                                        {job.status}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-400 lg:hidden mb-1">Estimated Cost</p>
                                    <p className="text-sm font-bold text-blue-600">
                                        Rs. {job.estimatedCost.toLocaleString()}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-400 lg:hidden mb-1">Problem</p>
                                    <p className="text-sm text-slate-600">
                                        {job.problem}
                                    </p>
                                </div>

                                {user?.role === "Admin" && (
                                    <div className="flex flex-row lg:flex-col gap-2">

                                        <button
                                            type="button"
                                            onClick={() => handleEdit(job)}
                                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-2 rounded-lg"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDelete(job._id)}
                                            className="bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold px-3 py-2 rounded-lg"
                                        >
                                            Delete
                                        </button>

                                    </div>
                                )}

                            </div>
                        ))}

                    </div>
                </div>
            )}

        </div>
    );
};
