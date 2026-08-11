import GuaranteeList from "../components/GuaranteeList";
import Link from "next/link";

export default function GuaranteesPage() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">保証一覧</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              これまでに登録された保証の一覧です。
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/home"
              className="text-sm text-zinc-500 hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              ← Topに戻る
            </Link>
          </div>
        </div>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <GuaranteeList />
        </section>
      </main>
    </div>
  );
}
