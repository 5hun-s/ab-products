"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ExamButton() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("alarmbox_access_token");
      setIsAuthenticated(!!token);
    };

    checkAuth();

    const handleAuthSuccess = () => setIsAuthenticated(true);
    window.addEventListener("alarmbox-auth-success", handleAuthSuccess);

    return () => {
      window.removeEventListener("alarmbox-auth-success", handleAuthSuccess);
    };
  }, []);

  return (
    <button
      onClick={() => router.push("/exams")}
      disabled={!isAuthenticated}
      className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      審査一覧
    </button>
  );
}
