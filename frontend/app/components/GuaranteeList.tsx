"use client";

import { useCallback } from "react";
import DataTable from "./ui/DataTable";
import { useAuthorizedResource } from "./auth/useAuthorizedResource";

const GUARANTEES_URL = `${process.env.NEXT_PUBLIC_BROWSER_API_URL}/guarantees`;

interface Guarantee {
  guarantee_id: number;
  company_name: string;
  guarantee_amount: number;
  status: string;
}

interface GuaranteesResponse {
  guarantees: Guarantee[];
}

export default function GuaranteeList() {
  const extractItems = useCallback(
    (data: unknown) => (data as GuaranteesResponse).guarantees ?? [],
    []
  );
  const { items: guarantees, loading, error } = useAuthorizedResource<Guarantee>(
    GUARANTEES_URL,
    extractItems,
    "保証一覧の取得に失敗しました"
  );

  if (loading) {
    return <p className="text-zinc-500">読み込み中...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (guarantees.length === 0) {
    return <p className="text-zinc-500">保証データがありません。</p>;
  }

  return (
    <DataTable
      items={guarantees}
      rowKey={(guarantee) => guarantee.guarantee_id}
      columns={[
        { header: "ID", render: (guarantee) => guarantee.guarantee_id },
        { header: "企業名", render: (guarantee) => guarantee.company_name },
        { header: "保証額", render: (guarantee) => guarantee.guarantee_amount },
        { header: "ステータス", render: (guarantee) => guarantee.status },
      ]}
    />
  );
}
