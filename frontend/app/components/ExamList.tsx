"use client";

import { useCallback } from "react";
import DataTable from "./ui/DataTable";
import { useAuthorizedResource } from "./auth/useAuthorizedResource";

const EXAMS_URL = `${process.env.NEXT_PUBLIC_BROWSER_API_URL}/exams`;

interface Exam {
  exam_id: number;
  company_name: string;
}

interface ExamsResponse {
  guarantee_exams: Exam[];
}

export default function ExamList() {
  const extractItems = useCallback(
    (data: unknown) => (data as ExamsResponse).guarantee_exams ?? [],
    []
  );
  const { items: exams, loading, error } = useAuthorizedResource<Exam>(
    EXAMS_URL,
    extractItems,
    "審査一覧の取得に失敗しました"
  );

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
    <DataTable
      items={exams}
      rowKey={(exam) => exam.exam_id}
      columns={[
        { header: "ID", render: (exam) => exam.exam_id },
        { header: "企業名", render: (exam) => exam.company_name },
      ]}
    />
  );
}
