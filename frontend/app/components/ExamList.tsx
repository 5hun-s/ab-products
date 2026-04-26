"use client";

import { useEffect, useState } from "react";

const EXAMS_URL = `${process.env.NEXT_PUBLIC_BROWSER_API_URL}/exams`;

interface Exam {
  exam_id: number;
  company_name: string;
}

export default function ExamList() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExams() {
      const token = localStorage.getItem("alarmbox_access_token");
      if (!token) {
        setError("認証が必要です。Top画面からアラームボックス連携を行ってください。");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(EXAMS_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "審査一覧の取得に失敗しました");
          setLoading(false);
          return;
        }

        setExams(Array.isArray(data) ? data : data.guarantee_exams ?? []);
      } catch {
        setError("通信エラーが発生しました");
      } finally {
        setLoading(false);
      }
    }

    fetchExams();
  }, []);

  if (loading) {
    return <p className="text-zinc-500">読み込み中...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (exams.length === 0) {
    return <p className="text-zinc-500">審査データがありません。</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-700">
            <th className="px-4 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300">ID</th>
            <th className="px-4 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300">企業名</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam) => (
            <tr
              key={exam.exam_id}
              className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              <td className="px-4 py-3 text-zinc-900 dark:text-zinc-100">{exam.exam_id}</td>
              <td className="px-4 py-3 text-zinc-900 dark:text-zinc-100">{exam.company_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
