"use client"
import { findManyHistorical } from "@/app/lib/@backend/action";
import { CreateHistoricalForm } from "@/app/lib/@frontend/ui/component";
import { useQuery } from "@tanstack/react-query";

interface Props {
  searchParams: {
    id: string;
  };
}

export default function Page({ searchParams }: Props) {
  const { id: accountId } = searchParams;

    const { data: historicalData, isLoading: accountLoading } = useQuery({
    queryKey: ["findManyHistorical", accountId],
    queryFn: async () => await findManyHistorical({ accountId: accountId }),
    enabled: !!accountId,
  });

  console.log({historicalData})


  return (
    <div className="flex flex-col items-center">
      <CreateHistoricalForm historical={historicalData?.docs ?? []} accountId={accountId} />
    </div>
  );
}
