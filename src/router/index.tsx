
import {
    BrowserRouter,
    Navigate,
    Route,
    Routes
} from "react-router-dom";

import type { ReactNode } from "react";

import { useAuth } from "../hooks/useAuth";

import Register from "../pages/Register";
import Login from "../pages/Login";

import { Home } from "../pages/Home";
import { CreateIssue } from "../pages/CreateIssue";
import { Customers } from "../pages/Customers.tsx";
import { RepairJobs } from "../pages/RepairJobs";
import { AdminDashboard } from "../pages/AdminDashboard";

import { MainLayout } from "../components/layout/MainLayout";

// Protected Route Interface
type RequireAuthTypes = {
    children: ReactNode;
    roles?: string[];
};

// Protect Routes
const RequireAuth = ({
                         children,
                         roles
                     }: RequireAuthTypes) => {

    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="flex gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(user.role)) {
        return (
            <div className="text-center py-20 px-4">
                <h2 className="text-xl font-bold mb-2">
                    Access Denied
                </h2>

                <p className="text-sm text-slate-600">
                    You do not have permission to view this page.
                </p>
            </div>
        );
    }

    return <>{children}</>;
};

// Application Router
export default function AppRouter() {

    return (
        <BrowserRouter>

            <Routes>

                {/* Public Routes */}
                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* Protected Routes */}
                <Route
                    element={
                        <RequireAuth>
                            <MainLayout />
                        </RequireAuth>
                    }
                >

                    {/* Home Page */}
                    <Route
                        path="/"
                        element={<Home />}
                    />

                    {/* Customer Management */}
                    <Route
                        path="/customers"
                        element={<Customers />}
                    />

                    {/* Old URL Redirect */}
                    <Route
                        path="/my-issues"
                        element={<Navigate to="/customers" replace />}
                    />

                    {/* Repair Jobs */}
                    <Route
                        path="/repair-jobs"
                        element={<RepairJobs />}
                    />

                    {/* Create Repair Job - Admin Only */}
                    <Route
                        path="/report"
                        element={
                            <RequireAuth roles={["Admin"]}>
                                <CreateIssue />
                            </RequireAuth>
                        }
                    />

                    {/* Admin Dashboard - Admin Only */}
                    <Route
                        path="/admin"
                        element={
                            <RequireAuth roles={["Admin"]}>
                                <AdminDashboard />
                            </RequireAuth>
                        }
                    />

                </Route>

                {/* Unknown Routes */}
                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>

        </BrowserRouter>
    );
}
