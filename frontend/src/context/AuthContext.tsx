import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("taskforge_token");
      const storedUser = localStorage.getItem("taskforge_user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        // Optionally verify session validity with backend
        try {
          const res = await api.get("/auth/me");
          if (res.data && res.data.success) {
            setUser(res.data.data.user);
            localStorage.setItem("taskforge_user", JSON.stringify(res.data.data.user));
          }
        } catch (err) {
          // Token expired or invalid
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();

    // Listen to token expiration event from api interceptor
    const handleAuthExpired = () => {
      logout();
    };

    window.addEventListener("auth_expired", handleAuthExpired);
    return () => {
      window.removeEventListener("auth_expired", handleAuthExpired);
    };
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token: receivedToken, user: receivedUser } = res.data.data;

      localStorage.setItem("taskforge_token", receivedToken);
      localStorage.setItem("taskforge_user", JSON.stringify(receivedUser));

      setToken(receivedToken);
      setUser(receivedUser);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to login. Please check credentials.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      await api.post("/auth/register", { name, email, password });
      // Automatically login after successful registration
      await login(email, password);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to register user.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("taskforge_token");
    localStorage.removeItem("taskforge_user");
    setToken(null);
    setUser(null);
    setError(null);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
