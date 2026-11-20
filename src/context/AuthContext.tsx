
import {
  createContext,
  useEffect,
  useState,
  type ReactNode
} from "react";

import { getMyDetails } from "../service/auth";
import { useAppDispatch } from "../redux/hooks";
import { setCredentials, clearCredentials } from "../redux/authSlice";

// Auth Context Interface
export interface AuthContextValue {
  loading: boolean;
}

// Create Auth Context
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | null>(null);

// Auth Provider
const AuthProvider = ({ children }: { children: ReactNode }) => {

  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(
      () => !!localStorage.getItem("ACCESS_TOKEN")
  );

  // Check Logged-in User
  useEffect(() => {

    const token = localStorage.getItem("ACCESS_TOKEN");

    if (!token) {
      return;
    }

    getMyDetails()
        .then((res) => {
          if (res.data) {
            dispatch(setCredentials(res.data));
          } else {
            dispatch(clearCredentials());
          }
        })
        .catch((err) => {
          console.error(err);
          dispatch(clearCredentials());
        })
        .finally(() => {
          setLoading(false);
        });

  }, [dispatch]);

  return (
      <AuthContext.Provider value={{ loading }}>
        {children}
      </AuthContext.Provider>
  );
};

export default AuthProvider;
