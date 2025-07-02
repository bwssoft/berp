import { findManyHistorical } from "@/app/lib/@backend/action/commercial/historical.action";
import { AccountHistoricalDataPage } from "@/app/lib/@frontend/ui/page/commercial/account/data/account-management.data";

interface Props {
  searchParams: {
    id: string;
  };
}

export default async function Page({ searchParams }: Props) {
  const { id: accountId } = searchParams;
  const historicalData = await findManyHistorical({accountId: accountId})

  return (
    <AccountHistoricalDataPage 
      accountId={accountId}
      historical={historicalData.docs}
    />
  );
}
