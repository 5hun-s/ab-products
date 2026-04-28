"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const EXAMS_URL = `${process.env.NEXT_PUBLIC_BROWSER_API_URL}/exams`;

export default function ExamNewPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    company_name: "",
    representative_name: "",
    address: "",
    corporation_number: "",
    guarantee_amount_hope: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const token = localStorage.getItem("alarmbox_access_token");
    if (!token) {
      setError("認証が必要です。Top画面からアラームボックス連携を行ってください。");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(EXAMS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          exam: {
            ...form,
            guarantee_amount_hope: form.guarantee_amount_hope
              ? Number(form.guarantee_amount_hope)
              : undefined,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "審査依頼の登録に失敗しました");
        return;
      }

      router.push("/exams");
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setSubmitting(false);
    }
  };

  const fields: { name: keyof typeof form; label: string; type?: string }[] = [
    { name: "company_name", label: "企業名" },
    { name: "representative_name", label: "代表者名" },
    { name: "address", label: "住所" },
    { name: "corporation_number", label: "法人番号" },
    { name: "guarantee_amount_hope", label: "希望保証額", type: "number" },
  ];

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-xl flex-col py-16 px-8 bg-white dark:bg-black">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            審査依頼
          </h1>
          <button
            type="button"
            onClick={() => router.push("/exams")}
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            ← 審査一覧に戻る
          </button>
        </div>

        {error && (
          <p className="mb-6 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
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
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-green-600 px-6 text-white font-medium transition-colors hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "送信中..." : "審査依頼を送信"}
          </button>
        </form>
      </main>
    </div>
  );
}
