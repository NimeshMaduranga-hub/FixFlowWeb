
import React, { useEffect, useState } from "react";

import {
    getAllCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    type Customer
} from "../service/customer";

import { PageHeader } from "../components/common/PageHeader";

export const Customers: React.FC = () => {

    const [customers, setCustomers] = useState<Customer[]>([]);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [editingId, setEditingId] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");

    // Fetch Customers on Initial Render
    useEffect(() => {

        let active = true;

        const loadCustomers = async () => {

            try {

                const response = await getAllCustomers();

                if (!active) return;

                setCustomers(response.data ?? []);

                setError("");

            } catch (error) {

                console.error("Customer Fetch Error:", error);

                if (active) {
                    setError("Failed to load customers.");
                }

            } finally {

                if (active) {
                    setLoading(false);
                }

            }
        };

        loadCustomers();

        return () => {
            active = false;
        };

    }, []);

    // Refresh Customers
    const fetchCustomers = async () => {

        try {

            const response = await getAllCustomers();

            setCustomers(response.data ?? []);

            setError("");

        } catch (error) {

            console.error("Customer Refresh Error:", error);

            setError("Failed to refresh customers.");

        }
    };

    // Reset Form
    const resetForm = () => {

        setName("");
        setPhone("");
        setEmail("");
        setAddress("");

        setEditingId(null);

        setShowForm(false);
    };

    // Open Create Form
    const handleCreate = () => {

        resetForm();

        setShowForm(true);
    };

    // Open Update Form
    const handleEdit = (customer: Customer) => {

        setEditingId(customer._id);

        setName(customer.name);
        setPhone(customer.phone);
        setEmail(customer.email);
        setAddress(customer.address);

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // Create / Update Customer
    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        if (
            !name.trim() ||
            !phone.trim() ||
            !email.trim() ||
            !address.trim()
        ) {

            alert("Please fill all fields.");

            return;
        }

        setSaving(true);

        const customerData = {
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim(),
            address: address.trim()
        };

        try {

            if (editingId) {

                await updateCustomer(editingId, customerData);

                alert("Customer updated successfully!");

            } else {

                await createCustomer(customerData);

                alert("Customer created successfully!");

            }

            resetForm();

            await fetchCustomers();

        } catch (error) {

            console.error("Customer Save Error:", error);

            alert(
                "Failed to save customer. Please check the details and try again."
            );

        } finally {

            setSaving(false);

        }
    };

    // Delete Customer
    const handleDelete = async (id: string) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this customer?"
        );

        if (!confirmed) return;

        try {

            await deleteCustomer(id);

            alert("Customer deleted successfully!");

            await fetchCustomers();

        } catch (error) {

            console.error("Customer Delete Error:", error);

            alert(
                "Failed to delete customer. Please try again."
            );

        }
    };

    return (

        <div className="max-w-6xl mx-auto space-y-6">

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <PageHeader
                    title="Customer Management"
                    description="Create, view, update and manage registered customers."
                />

                <button
                    type="button"
                    onClick={handleCreate}
                    className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition"
                >
                    + Add Customer
                </button>

            </div>

            {/* Customer Form */}
            {showForm && (

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

                    <div className="flex items-center justify-between mb-6">

                        <h2 className="text-lg font-bold text-slate-900">
                            {editingId ? "Update Customer" : "Add New Customer"}
                        </h2>

                        <button
                            type="button"
                            onClick={resetForm}
                            className="text-sm font-semibold text-slate-500 hover:text-red-600"
                        >
                            Cancel
                        </button>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {/* Customer Name */}
                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Customer Name
                                </label>

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter customer name"
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />

                            </div>

                            {/* Phone */}
                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Phone Number
                                </label>

                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Enter phone number"
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />

                            </div>

                            {/* Email */}
                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter email address"
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />

                            </div>

                            {/* Address */}
                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Address
                                </label>

                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Enter customer address"
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />

                            </div>

                        </div>

                        {/* Form Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-3">

                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-semibold rounded-xl transition"
                            >
                                {saving
                                    ? "Saving..."
                                    : editingId
                                        ? "Update Customer"
                                        : "Create Customer"
                                }
                            </button>

                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition"
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>

            )}

            {/* Loading */}
            {loading && (

                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">

                    <p className="text-sm text-slate-500">
                        Loading customers...
                    </p>

                </div>

            )}

            {/* Error */}
            {!loading && error && (

                <div className="bg-red-50 border border-red-200 rounded-2xl p-5">

                    <p className="text-red-600 text-sm">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={fetchCustomers}
                        className="mt-3 text-sm font-semibold text-red-700 underline"
                    >
                        Try Again
                    </button>

                </div>

            )}

            {/* Customer Count */}
            {!loading && !error && (

                <div className="flex items-center justify-between">

                    <p className="text-sm text-slate-500">
                        Total Customers
                    </p>

                    <span className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-bold rounded-lg">
                        {customers.length} Customers
                    </span>

                </div>

            )}

            {/* Empty Customers */}
            {!loading && !error && customers.length === 0 && (

                <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl">

                    <h3 className="text-lg font-semibold text-slate-800">
                        No Customers Found
                    </h3>

                    <p className="text-slate-500 text-sm mt-2">
                        Add your first customer to get started.
                    </p>

                </div>

            )}

            {/* Customer List */}
            {!loading && !error && customers.length > 0 && (

                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

                    {/* Table Header */}
                    <div className="hidden md:grid md:grid-cols-5 gap-4 p-4 bg-slate-50 border-b border-slate-200">

                        <p className="text-xs font-bold text-slate-500 uppercase">
                            Customer Name
                        </p>

                        <p className="text-xs font-bold text-slate-500 uppercase">
                            Phone
                        </p>

                        <p className="text-xs font-bold text-slate-500 uppercase">
                            Email
                        </p>

                        <p className="text-xs font-bold text-slate-500 uppercase">
                            Address
                        </p>

                        <p className="text-xs font-bold text-slate-500 uppercase text-right">
                            Actions
                        </p>

                    </div>

                    {/* Customer Records */}
                    <div className="divide-y divide-slate-100">

                        {customers.map((customer) => (

                            <div
                                key={customer._id}
                                className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4 p-5 hover:bg-slate-50 transition"
                            >

                                <div>

                                    <p className="text-xs text-slate-400 md:hidden mb-1">
                                        Customer Name
                                    </p>

                                    <p className="font-semibold text-sm text-slate-900">
                                        {customer.name}
                                    </p>

                                </div>

                                <div>

                                    <p className="text-xs text-slate-400 md:hidden mb-1">
                                        Phone
                                    </p>

                                    <p className="text-sm text-slate-600">
                                        {customer.phone}
                                    </p>

                                </div>

                                <div>

                                    <p className="text-xs text-slate-400 md:hidden mb-1">
                                        Email
                                    </p>

                                    <p className="text-sm text-slate-600 break-all">
                                        {customer.email}
                                    </p>

                                </div>

                                <div>

                                    <p className="text-xs text-slate-400 md:hidden mb-1">
                                        Address
                                    </p>

                                    <p className="text-sm text-slate-600">
                                        {customer.address}
                                    </p>

                                </div>

                                <div className="flex items-center justify-start md:justify-end gap-3">

                                    <button
                                        type="button"
                                        onClick={() => handleEdit(customer)}
                                        className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDelete(customer._id)}
                                        className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-lg transition"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            )}

        </div>
    );
};
