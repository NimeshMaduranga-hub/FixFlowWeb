
import api from "./api";

// Login User
export const login = async (email: string, password: string) => {
  const res = await api.post("/auth/login", {
    email,
    password
  });

  return res.data;
};

// Register User
export const register = async (
    name: string,
    email: string,
    password: string
) => {
  const res = await api.post("/auth/register", {
    name,
    email,
    password
  });

  return res.data;
};

// Get My Details
export const getMyDetails = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

// Refresh Access Token
export const refreshTokenCall = async (refreshToken: string) => {
  const res = await api.post("/auth/refresh", {
    refresh_token: refreshToken
  });

  return res.data;
};

// Logout User
export const logout = async (refreshToken: string) => {
  const res = await api.post("/auth/logout", {
    refresh_token: refreshToken
  });

  return res.data;
};