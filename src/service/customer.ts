
import api from "./api";

// Customer Interface
export interface Customer {
    _id: string;
    name: string;
    phone: string;
    email: string;
    address: string;
    createdAt?: string;
    updatedAt?: string;
}

// Create Customer
export const createCustomer = async (
    customerData: Omit<Customer, "_id" | "createdAt" | "updatedAt">
) => {
    const res = await api.post("/customers", customerData);
    return res.data;
};

// Get All Customers
export const getAllCustomers = async () => {
    const res = await api.get("/customers");
    return res.data;
};

// Get Customer By ID
export const getCustomerById = async (id: string) => {
    const res = await api.get(`/customers/${id}`);
    return res.data;
};

// Update Customer
export const updateCustomer = async (
    id: string,
    customerData: Partial<Omit<Customer, "_id">>
) => {
    const res = await api.put(`/customers/${id}`, customerData);
    return res.data;
};

// Delete Customer
export const deleteCustomer = async (id: string) => {
    const res = await api.delete(`/customers/${id}`);
    return res.data;
};
