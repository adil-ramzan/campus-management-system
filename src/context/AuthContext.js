import React, { createContext, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // The signed-in user is kept in memory only. Nothing about the session is
  // written to browser storage; the backend session cookie is the source of truth.
  const [user, setUser] = useState(null);

  const signup = async ({ name, email, password }) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/auth/signup`,
        { name: name.trim(), email: email.trim().toLowerCase(), password },
        { withCredentials: true }
      );

      if (res.data?.user) {
        setUser(res.data.user);
        return { success: true, role: res.data.user.role };
      }
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Signup failed" };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/auth/login`,
        { email: email.trim().toLowerCase(), password },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setUser(res.data.user);
        return { success: true, role: res.data.user.role };
      }
      return { success: false, message: "Login failed" };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  };

  const logout = async (navigate) => {
    setUser(null);
    navigate("/login");

    try {
      await axios.get(`${API_URL}/api/auth/logout`, { withCredentials: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
