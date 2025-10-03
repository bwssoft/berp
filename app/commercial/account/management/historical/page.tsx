"use client";
import { findManyHistorical } from "@/app/lib/@backend/action/commercial/historical.action";
import { HistoricalDataPage } from "@/app/lib/@frontend/ui/page/commercial/account/data/historical.data";
import { useQuery } from "@tanstack/react-query";

interface Props {
  searchParams: {
    id: string;
    page?: string | number;
  };
}

export default function Page({ searchParams }: Props) {
  const { id: accountId, page } = searchParams;

  const _page = page ? Number(page) : 1;

  const historicalQuery = useQuery({
    queryKey: ["historical", accountId, _page],
    queryFn: () => findManyHistorical({ accountId }, _page),
  });

  return (
    <HistoricalDataPage
      historical={historicalQuery.data ?? null}
      accountId={accountId}
      currentPage={_page}
    />
  );
}
