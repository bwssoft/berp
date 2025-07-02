"use client"
import { IHistorical } from "@/app/lib/@backend/domain";
import { CreateHistoricalForm } from "../../../../form/commercial/account/historical/create/create.historical.form";
import { TimelineItem } from "../../../../list/commercial/historical/time-line-item";
import { CreateAnnexHistoricalModal } from "../../../../modal/comercial/account-attachments/create/annex-historical/annex-historical.create.commercial.modal";
import { useCreateHistoricalForm } from "../../../../form/commercial/account/historical/create/use-create.historical.form";
import { useCreateAnnexHistoricalModal } from "../../../../modal/comercial/account-attachments/create/annex-historical/use-annex-historical.create.commercial.modal";

interface Props {
    historical: IHistorical[]
    accountId: string
}

export function HistoricalDataPage({ historical, accountId }:Props) {
  const {
    handleDownload,
    handleFileChange,
    open
  } = useCreateHistoricalForm({accountId})

  const {closeModal} = useCreateAnnexHistoricalModal()
    return (
    <div className="flex flex-col items-center">
      <CreateHistoricalForm
        historical={historical ?? []}
        accountId={accountId}
      />

      <TimelineItem
        onClickButtonDownload={(id: string, name: string) =>
            handleDownload(id, name)
        }
        historical={historical}
      />
      
      <CreateAnnexHistoricalModal
          closeModal={closeModal}
          onFileUploadSuccess={handleFileChange}
          open={open}
          accountId={accountId}
      />
    </div>
    )
}