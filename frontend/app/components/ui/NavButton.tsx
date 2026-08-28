"use client";

import { useRouter } from "next/navigation";
import { useHasAccessToken } from "../auth/useHasAccessToken";

interface NavButtonProps {
  href: string;
  label: string;
}

export default function NavButton({ href, label }: NavButtonProps) {
  const hasToken = useHasAccessToken();
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(href)}
      disabled={!hasToken}
      className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {label}
    </button>
  );
}
