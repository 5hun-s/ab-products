import ExamList from "../components/ExamList";
import Link from "next/link";

export default function ExamsPage() {
  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-5xl flex-col py-16 px-8 bg-white dark:bg-black">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            審査一覧
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/exams/new"
              className="inline-flex h-9 items-center justify-center rounded-full bg-green-600 px-4 text-sm text-white font-medium transition-colors hover:bg-green-700"
            >
              + 審査依頼
            </Link>
            <Link
              href="/"
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              ← Topに戻る
            </Link>
          </div>
        </div>
        <ExamList />
      </main>
    </div>
  );
}
