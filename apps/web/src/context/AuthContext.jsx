import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000"
});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("cordia_token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("cordia_user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [token]);

  const login = async ({ email, password }) => {
    const { data } = await api.post("/api/auth/login", { email, password });
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("cordia_token", data.token);
    localStorage.setItem("cordia_user", JSON.stringify(data.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("cordia_token");
    localStorage.removeItem("cordia_user");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, api }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
