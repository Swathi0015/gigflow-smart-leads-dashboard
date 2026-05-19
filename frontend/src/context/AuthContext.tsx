import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000/api";

interface AuthContextType {
  user: any;
  token: string | null;
  loading: boolean;
  register: (email: string, password: string, role: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      if (token) {
        try {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          // Optional: Fetch current user profile from backend to sync state
        } catch (err) {
          logout();
        }
      }
      setLoading(false);
    };
    bootstrapAuth();
  }, [token]);

  // 🟢 LIVE PRODUCTION REGISTER METHOD
  const register = async (email: string, password: string, role: string) => {
    const response = await axios.post("/auth/register", { email, password, role });
    const { token: receivedToken, user: receivedUser } = response.data;
    
    localStorage.setItem("token", receivedToken);
    axios.defaults.headers.common["Authorization"] = `Bearer ${receivedToken}`;
    setToken(receivedToken);
    setUser(receivedUser);
  };

  // 🟢 LIVE PRODUCTION LOGIN METHOD
  const login = async (email: string, password: string) => {
    const response = await axios.post("/auth/login", { email, password });
    const { token: receivedToken, user: receivedUser } = response.data;
    
    localStorage.setItem("token", receivedToken);
    axios.defaults.headers.common["Authorization"] = `Bearer ${receivedToken}`;
    setToken(receivedToken);
    setUser(receivedUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 🌟 CRITICAL EXPORT MATCHING YOUR NAMED IMPORTS
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}