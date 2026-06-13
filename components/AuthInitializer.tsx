"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { getMe } from "@/services";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { setUser, setStatus } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("unauthenticated");
      return;
    }
    setStatus("loading");
    getMe()
      .then((res) => {
        if (res?.data?.user) {
          setUser(res.data.user);
          setStatus("authenticated");
        } else {
          localStorage.removeItem("token");
          setStatus("unauthenticated");
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        setStatus("unauthenticated");
      });
  }, []);

  return <>{children}</>;
}
