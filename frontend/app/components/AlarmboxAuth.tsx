"use client";

import { useState } from "react";

const ALARMBOX_AUTH_URL = `${process.env.NEXT_PUBLIC_BROWSER_API_URL}/auth/alarmbox`;
const CALLBACK_URL = `${process.env.NEXT_PUBLIC_BROWSER_API_URL}/auth/alarmbox/callback`;

export default function AlarmboxAuth() {
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"idle" | "waiting" | "loading" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  function openAuthWindow() {
    window.open(ALARMBOX_AUTH_URL, "_blank");
    setStep("waiting");
    setError(null);
  }

  async function submitCode() {
    if (!code.trim()) return;
    setStep("loading");
    setError(null);

    try {
      const res = await fetch(CALLBACK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "認証に失敗しました");
        setStep("waiting");
        return;
      }

      localStorage.removeItem("alarmbox_access_token");
      localStorage.removeItem("alarmbox_refresh_token");
      localStorage.removeItem("alarmbox_expires_at");

      localStorage.setItem("alarmbox_access_token", data.access_token);
      if (data.refresh_token) {
        localStorage.setItem("alarmbox_refresh_token", data.refresh_token);
      }
      if (data.expires_in) {
        localStorage.setItem("alarmbox_expires_at", String(Date.now() + Number(data.expires_in) * 1000));
      }

      setStep("success");
      window.dispatchEvent(new Event("alarmbox-auth-success"));
    } catch {
      setError("通信エラーが発生しました");
      setStep("waiting");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={openAuthWindow}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 text-white font-medium transition-colors hover:bg-blue-700"
      >
        アラームボックスと連携する
      </button>

      {step === "success" ? (
        <p className="text-sm font-medium text-green-600">アラームボックスと連携しました！</p>
      ) : step === "waiting" || step === "loading" ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            認証画面で表示されたコードを貼り付けてください
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="認可コード"
              className="flex-1 h-10 rounded-lg border border-zinc-300 px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
              disabled={step === "loading"}
            />
            <button
              onClick={submitCode}
              disabled={step === "loading" || !code.trim()}
              className="h-10 rounded-lg bg-blue-600 px-4 text-sm text-white font-medium transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {step === "loading" ? "処理中..." : "送信"}
            </button>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      ) : null}

    </div>
  );
}
