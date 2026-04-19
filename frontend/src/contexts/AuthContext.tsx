import React, { createContext, useContext, useState, useCallback } from "react";
import { User, UserRole } from "@/types/oms";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("oms_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      if (response.ok) {
        const found = await response.json();
        setUser(found);
        localStorage.setItem("oms_user", JSON.stringify(found));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, role: UserRole) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (response.ok) {
        const newUser = await response.json();
        setUser(newUser);
        localStorage.setItem("oms_user", JSON.stringify(newUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("oms_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
