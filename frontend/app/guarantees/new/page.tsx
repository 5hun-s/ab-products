"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "../../components/auth/alarmbox-auth";

const GUARANTEES_URL = `${process.env.NEXT_PUBLIC_BROWSER_API_URL}/guarantees`;

export default function GuaranteeNewPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    exam_id: "",
    guarantee_amount_hope: "",
    guarantee_start_at: "",
    guarantee_end_at: "",
  });
  const [autoIncrement, setAutoIncrement] = useState(false);
  const [endOfGuaranteeRequest, setEndOfGuaranteeRequest] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const examId = new URLSearchParams(window.location.search).get("exam_id");
    if (examId) {
      setForm((prev) => ({ ...prev, exam_id: examId }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const token = getAccessToken();
    if (!token) {
      setError("認証が必要です。Top画面からアラームボックス連携を行ってください。");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(GUARANTEES_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          guarantee: {
            exam_id: form.exam_id ? Number(form.exam_id) : undefined,
            guarantee_amount_hope: form.guarantee_amount_hope
              ? Number(form.guarantee_amount_hope)
              : undefined,
            guarantee_start_at: form.guarantee_start_at,
            guarantee_end_at: form.guarantee_end_at,
            auto_increment: autoIncrement,
            end_of_guarantee_request: endOfGuaranteeRequest,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "保証依頼の登録に失敗しました");
        return;
      }

      router.push("/guarantees");
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setSubmitting(false);
    }
  };

  const fields: { name: keyof typeof form; label: string; type?: string }[] = [
    { name: "exam_id", label: "保証審査ID", type: "number" },
    { name: "guarantee_amount_hope", label: "希望保証額", type: "number" },
    { name: "guarantee_start_at", label: "保証開始日", type: "date" },
    { name: "guarantee_end_at", label: "保証終了日", type: "date" },
  ];

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-xl flex-1 flex-col gap-6 px-6 py-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">保証依頼</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              保証審査を指定して保証依頼を行います。
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/guarantees")}
            className="text-sm text-zinc-500 hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            ← 保証一覧に戻る
          </button>
        </div>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          {error && (
            <p className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {fields.map(({ name, label, type }) => (
              <div key={name} className="flex flex-col gap-1">
                <label
                  htmlFor={name}
                  className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  {label}
                </label>
                <input
                  id={name}
                  name={name}
                  type={type ?? "text"}
                  value={form[name]}
                  onChange={handleChange}
                  required
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                />
              </div>
            ))}

            <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={autoIncrement}
                onChange={(e) => setAutoIncrement(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-700"
              />
              保証極度額を自動増額する
            </label>

            <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={endOfGuaranteeRequest}
                onChange={(e) => setEndOfGuaranteeRequest(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-700"
              />
              今回の保証依頼を最後にする
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 inline-flex h-9 w-fit shrink-0 items-center justify-center self-start rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "送信中..." : "保証依頼を送信"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
