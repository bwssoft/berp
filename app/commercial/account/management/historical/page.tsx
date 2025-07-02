import { findManyHistorical } from "@/app/lib/@backend/action/commercial/historical.action";
import { CreateHistoricalForm } from "@/app/lib/@frontend/ui/component";
import { AccountManagementDataPage } from "@/app/lib/@frontend/ui/page/commercial/account/data/account-management.data";

interface Props {
  searchParams: {
    id: string;
  };
}

export default async function Page({ searchParams }: Props) {
  const { id: accountId } = searchParams;
  const historicalData = await findManyHistorical({accountId: accountId})

  return (
    <AccountManagementDataPage 
      accountId={accountId}
      historical={historicalData.docs}
    />
  );
}
