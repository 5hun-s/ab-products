"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GuaranteeButton() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("alarmbox_access_token");
      setIsAuthenticated(!!token);
    };

    checkAuth();

    const handleAuthSuccess = () => setIsAuthenticated(true);
    const handleAuthDisconnect = () => setIsAuthenticated(false);
    window.addEventListener("alarmbox-auth-success", handleAuthSuccess);
    window.addEventListener("alarmbox-auth-disconnect", handleAuthDisconnect);

    return () => {
      window.removeEventListener("alarmbox-auth-success", handleAuthSuccess);
      window.removeEventListener("alarmbox-auth-disconnect", handleAuthDisconnect);
    };
  }, []);

  return (
    <button
      onClick={() => router.push("/guarantees")}
      disabled={!isAuthenticated}
      className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      保証一覧
    </button>
  );
}
