import AlarmboxAuth from "../components/AlarmboxAuth";
import ExamButton from "../components/ExamButton";

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center gap-8 py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="w-full">
          <AlarmboxAuth />
        </div>
        <div className="w-full">
          <ExamButton />
        </div>
      </main>
    </div>
  );
}
