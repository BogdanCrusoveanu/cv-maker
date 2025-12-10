import React, { createContext, useContext } from "react";
import api from "../services/api";
import JSEncrypt from "jsencrypt";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface User {
  token: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  deleteAccount: () => Promise<void>;
  loading: boolean;
  encryptPassword: (password: string) => string | false;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();

  // Fetch Public Key
  const { data: publicKey, isLoading: publicKeyLoading } = useQuery({
    queryKey: ["publicKey"],
    queryFn: async () => {
      const response = await api.getPublicKey();
      return response.data.publicKey;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  // Check Auth Session (Refresh Token)
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const response = await api.post("/auth/refresh");
        const { name } = response.data;
        return { token: "cookie", name: name || "User" };
      } catch (error) {
        return null;
      }
    },
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    // Only run if the logged_in cookie exists and we are not on a shared page
    enabled:
      document.cookie.includes("logged_in=true") &&
      !window.location.pathname.includes("/shared/"),
  });

  const loading = publicKeyLoading || userLoading;

  const encryptPassword = (password: string) => {
    if (!publicKey) {
      console.error("Public key not available");
      throw new Error("Encryption service unavailable");
    }
    const encryptor = new JSEncrypt();
    encryptor.setPublicKey(publicKey);
    const encrypted = encryptor.encrypt(password);
    if (!encrypted) {
      throw new Error("Encryption failed");
    }
    return encrypted;
  };

  const login = async (email: string, password: string) => {
    const encryptedPassword = encryptPassword(password);
    const response = await api.post("/auth/login", {
      email,
      password: encryptedPassword,
    });
    const { name } = response.data;
    queryClient.setQueryData(["user"], {
      token: "cookie",
      name: name || "User",
    });
  };

  const register = async (email: string, password: string, name: string) => {
    const encryptedPassword = encryptPassword(password);
    await api.post("/auth/register", {
      email,
      password: encryptedPassword,
      name,
    });
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      console.error("Logout failed", e);
    }
    queryClient.setQueryData(["user"], null);
  };

  const deleteAccount = async () => {
    await api.delete("/auth/delete-account");
    logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        login,
        register,
        logout,
        deleteAccount,
        loading,
        encryptPassword,
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
