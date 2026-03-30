"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState
} from "react";
import { apiRequest } from "@/lib/api";
import socket from "@/lib/socket";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "organizer" | "admin";
  gender: string;
  location: string;
  preferredGames: string[];
  skillLevel: string;
  availability: { days: string[]; timeSlot: string };
  preferredLocations: string[];
  bio: string;
  communities?: Array<{ _id: string; name: string }>;
};

type AuthValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: Record<string, unknown>) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

const STORAGE_KEY = "playcircle-auth-token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser(nextToken?: string) {
    const activeToken = nextToken || token || localStorage.getItem(STORAGE_KEY);

    if (!activeToken) {
      startTransition(() => {
        setUser(null);
        setToken(null);
        setLoading(false);
      });
      return;
    }

    try {
      const me = await apiRequest<User>("/auth/me", {
        token: activeToken
      });
      startTransition(() => {
        setUser(me);
        setToken(activeToken);
        setLoading(false);
      });
    } catch (_error) {
      localStorage.removeItem(STORAGE_KEY);
      startTransition(() => {
        setUser(null);
        setToken(null);
        setLoading(false);
      });
    }
  }

  useEffect(() => {
    refreshUser();
  }, []);

  useEffect(() => {
    if (!user?._id) {
      socket.disconnect();
      return;
    }

    socket.connect();
    socket.emit("user:join", user._id);

    return () => {
      socket.off("chat:message");
      socket.off("request:new");
      socket.off("video:signal");
    };
  }, [user?._id]);

  async function login(email: string, password: string) {
    const response = await apiRequest<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: { email, password }
    });

    localStorage.setItem(STORAGE_KEY, response.token);
    startTransition(() => {
      setToken(response.token);
      setUser(response.user);
    });
  }

  async function register(payload: Record<string, unknown>) {
    const response = await apiRequest<{ token: string; user: User }>(
      "/auth/register",
      {
        method: "POST",
        body: payload
      }
    );

    localStorage.setItem(STORAGE_KEY, response.token);
    startTransition(() => {
      setToken(response.token);
      setUser(response.user);
    });
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    startTransition(() => {
      setUser(null);
      setToken(null);
    });
  }

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
