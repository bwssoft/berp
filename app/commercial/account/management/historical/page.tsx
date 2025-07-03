import { findManyHistorical } from "@/app/lib/@backend/action/commercial/historical.action";
import { HistoricalDataPage } from "@/app/lib/@frontend/ui/page/commercial/account/data/historical.data";

interface Props {
    searchParams: {
        id: string;
    };
}

export default async function Page({ searchParams }: Props) {
    const { id: accountId } = searchParams;
    const historicalData = await findManyHistorical({ accountId: accountId });

    return <HistoricalDataPage accountId={accountId} />;
}
