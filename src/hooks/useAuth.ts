
import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

import { useAppDispatch, useAppSelector } from "../redux/hooks";

import {
  setCredentials,
  clearCredentials
} from "../redux/authSlice";

export const useAuth = () => {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  // Get user from Redux Store
  const user = useAppSelector((state) => state.auth.user);

  // Get Redux dispatch function
  const dispatch = useAppDispatch();

  // Update user in Redux Store
  const setUser = (user: typeof context extends never ? never : import("../redux/authSlice").AuthUser | null) => {

    if (user) {
      dispatch(setCredentials(user));
    } else {
      dispatch(clearCredentials());
    }
  };

  return {
    user,
    setUser,
    loading: context.loading
  };
};
