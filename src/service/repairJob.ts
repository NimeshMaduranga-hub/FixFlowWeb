
import api from "./api";

// Repair Job Status
export type RepairJobStatus =
    | "Pending"
    | "In Progress"
    | "Completed";

// Repair Job Interface
export interface RepairJob {
    _id: string;
    customer: string | {
        _id: string;
        name: string;
        phone: string;
        email: string;
    };
    deviceName: string;
    deviceType: string;
    problem: string;
    technician: string;
    status: RepairJobStatus;
    estimatedCost: number;
    createdAt?: string;
    updatedAt?: string;
}

// Create Repair Job
export const createRepairJob = async (
    repairJobData: Omit<RepairJob, "_id" | "createdAt" | "updatedAt">
) => {
    const res = await api.post("/repair-jobs", repairJobData);
    return res.data;
};

// Get All Repair Jobs
export const getAllRepairJobs = async () => {
    const res = await api.get("/repair-jobs");
    return res.data;
};

// Get Repair Job By ID
export const getRepairJobById = async (id: string) => {
    const res = await api.get(`/repair-jobs/${id}`);
    return res.data;
};

// Update Repair Job
export const updateRepairJob = async (
    id: string,
    repairJobData: Partial<Omit<RepairJob, "_id">>
) => {
    const res = await api.put(`/repair-jobs/${id}`, repairJobData);
    return res.data;
};

// Delete Repair Job
export const deleteRepairJob = async (id: string) => {
    const res = await api.delete(`/repair-jobs/${id}`);
    return res.data;
};
