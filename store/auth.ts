"use client";

import { create } from "zustand";

export type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

type User = {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  user_type?: string;
};

type AuthState = {
  user: User | null;
  status: AuthStatus;
  setUser: (u: User | null) => void;
  setStatus: (s: AuthStatus) => void;
  logoutLocal: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "idle",
  setUser: (u) => set({ user: u }),
  setStatus: (s) => set({ status: s }),
  logoutLocal: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    set({ user: null, status: "unauthenticated" });
  },
}));
