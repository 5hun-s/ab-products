"use client";

import { useEffect, useState } from "react";
import { getAccessToken } from "./alarmbox-auth";

interface UseAuthorizedResourceResult<T> {
  items: T[];
  loading: boolean;
  error: string | null;
}

export function useAuthorizedResource<T>(
  url: string,
  extractItems: (data: unknown) => T[],
  failureMessage: string
): UseAuthorizedResourceResult<T> {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResource() {
      const token = getAccessToken();
      if (!token) {
        setError("認証が必要です。Top画面からアラームボックス連携を行ってください。");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (!res.ok) {
          setError((data as { error?: string }).error || failureMessage);
          setLoading(false);
          return;
        }

        setItems(extractItems(data));
      } catch {
        setError("通信エラーが発生しました");
      } finally {
        setLoading(false);
      }
    }

    fetchResource();
  }, [url, extractItems, failureMessage]);

  return { items, loading, error };
}
