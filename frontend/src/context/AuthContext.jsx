"use client";

import { createContext, useContext, useState, useEffect } from "react";
import apiService from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      apiService.setToken(token);
      getCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const getCurrentUser = async () => {
    try {
      const response = await apiService.getCurrentUser();
      if (response.success) {
        setUser(response.user);
      } else {
        // If the response doesn't have success: true, logout
        logout();
      }
    } catch (error) {
      console.error("Failed to get current user:", error);
      // Only logout if it's an auth error, not a network error
      if (error.message.includes("Authentication failed")) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await apiService.login(credentials);
      if (response.success && response.token) {
        apiService.setToken(response.token);
        setUser(response.user);
        return { success: true };
      } else {
        return { success: false, message: response.message || "Login failed" };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiService.register(userData);
      if (response.success && response.token) {
        apiService.setToken(response.token);
        setUser(response.user);
        return { success: true };
      } else {
        return {
          success: false,
          message: response.message || "Registration failed",
        };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    apiService.removeToken();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
