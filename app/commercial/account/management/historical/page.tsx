import { findManyHistorical } from "@/app/lib/@backend/action";
import { CreateHistoricalForm } from "@/app/lib/@frontend/ui/component";

interface Props {
  searchParams: {
    id: string;
  };
}

export default async function Page({ searchParams }: Props) {
  const { id: accountId } = searchParams;
  const historical = await findManyHistorical()

  return (
    <div className="flex flex-col items-center">
      <CreateHistoricalForm historical={historical.docs} accountId={accountId} />
    </div>
  );
}
