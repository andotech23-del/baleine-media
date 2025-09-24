import { useMemo } from "react";
import axios from "axios";
import { AuthProvider, useAuthContext } from "../context/AuthContext.jsx";

export function useAuth() {
  return useAuthContext();
}

export function useAuthorizedApi() {
  const { token } = useAuthContext();
  return useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000"
    });
    if (token) {
      instance.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
    return instance;
  }, [token]);
}

export { AuthProvider };
