"use client";

import { useEffect, useState } from "react";

const GUARANTEES_URL = `${process.env.NEXT_PUBLIC_BROWSER_API_URL}/guarantees`;

interface Guarantee {
  guarantee_id: number;
  company_name: string;
  guarantee_amount: number;
  status: string;
}

interface GuaranteesResponse {
  guarantees?: Guarantee[];
  error?: string;
}

export default function GuaranteeList() {
  const [guarantees, setGuarantees] = useState<Guarantee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGuarantees() {
      const token = localStorage.getItem("alarmbox_access_token");
      if (!token) {
        setError("認証が必要です。Top画面からアラームボックス連携を行ってください。");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(GUARANTEES_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data: Guarantee[] | GuaranteesResponse = await res.json();

        if (!res.ok) {
          setError((!Array.isArray(data) && data.error) || "保証一覧の取得に失敗しました");
          setLoading(false);
          return;
        }

        setGuarantees(Array.isArray(data) ? data : data.guarantees ?? []);
      } catch {
        setError("通信エラーが発生しました");
      } finally {
        setLoading(false);
      }
    }

    fetchGuarantees();
  }, []);

  if (loading) {
    return <p className="text-zinc-500">読み込み中...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (guarantees.length === 0) {
    return <p className="text-zinc-500">保証データがありません。</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-700">
            <th className="px-4 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300">ID</th>
            <th className="px-4 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300">企業名</th>
            <th className="px-4 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300">保証額</th>
            <th className="px-4 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300">ステータス</th>
          </tr>
        </thead>
        <tbody>
          {guarantees.map((guarantee) => (
            <tr
              key={guarantee.guarantee_id}
              className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              <td className="px-4 py-3 text-zinc-900 dark:text-zinc-100">{guarantee.guarantee_id}</td>
              <td className="px-4 py-3 text-zinc-900 dark:text-zinc-100">{guarantee.company_name}</td>
              <td className="px-4 py-3 text-zinc-900 dark:text-zinc-100">{guarantee.guarantee_amount}</td>
              <td className="px-4 py-3 text-zinc-900 dark:text-zinc-100">{guarantee.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
