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
      className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-green-600 px-6 text-white font-medium transition-colors hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      審査一覧
    </button>
  );
}
