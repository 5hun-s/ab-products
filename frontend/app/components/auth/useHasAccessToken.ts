"use client";

import { useEffect, useState } from "react";
import { getAccessToken } from "./alarmbox-auth";

export function useHasAccessToken(): boolean {
  const [hasToken, setHasToken] = useState(
    () => typeof window !== "undefined" && !!getAccessToken()
  );

  useEffect(() => {
    const handleAuthSuccess = () => setHasToken(true);
    const handleAuthDisconnect = () => setHasToken(false);
    window.addEventListener("alarmbox-auth-success", handleAuthSuccess);
    window.addEventListener("alarmbox-auth-disconnect", handleAuthDisconnect);

    return () => {
      window.removeEventListener("alarmbox-auth-success", handleAuthSuccess);
      window.removeEventListener("alarmbox-auth-disconnect", handleAuthDisconnect);
    };
  }, []);

  return hasToken;
}
