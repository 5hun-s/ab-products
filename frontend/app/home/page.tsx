import AlarmboxAuth from "../components/AlarmboxAuth";
import ExamButton from "../components/ExamButton";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">ホーム</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            アラームボックスと連携して、保証審査の確認を行えます。
          </p>
        </div>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">アラームボックス連携</h2>
          <p className="mt-1 mb-4 text-sm text-zinc-500 dark:text-zinc-400">
            保証審査を利用するには、まずアラームボックスと連携してください。
          </p>
          <AlarmboxAuth />
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">保証審査</h2>
          <p className="mt-1 mb-4 text-sm text-zinc-500 dark:text-zinc-400">
            連携済みの場合、審査の一覧を確認できます。
          </p>
          <ExamButton />
        </section>
      </main>
    </div>
  );
}
