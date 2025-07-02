"use client"
import { IHistorical } from "@/app/lib/@backend/domain";
import { CreateHistoricalForm } from "../../../../form/commercial/account/historical/create/create.historical.form";

interface Props {
    historical: IHistorical[]
    accountId: string
}

export function HistoricalDataPage({ historical, accountId }:Props) {
    return (
    <div className="flex flex-col items-center">
      <CreateHistoricalForm
        historical={historical ?? []}
        accountId={accountId}
      />
    </div>
    )
}