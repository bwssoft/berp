import { CreateHistoricalForm } from "@/app/lib/@frontend/ui/component";

interface Props {
  searchParams: {
    id: string;
  };
}

export default async function Page({ searchParams }: Props) {
  const { id: accountId } = searchParams;

  return (
    <div className="flex flex-col items-center">
      <CreateHistoricalForm accountId={accountId} />
    </div>
  );
}
