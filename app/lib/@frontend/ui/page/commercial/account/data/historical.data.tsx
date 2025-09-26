"use client";

import { useQuery } from "@tanstack/react-query";
import { findManyHistorical } from "@/app/lib/@backend/action/commercial/historical.action";
import { CreateHistoricalForm } from "../../../../form/commercial/account/historical/create/create.historical.form";
import { TimelineItem } from "../../../../list/commercial/historical/time-line-item";
import { CreateAnnexHistoricalModal } from "../../../../modal/comercial/account-attachments/create/annex-historical/annex-historical.create.commercial.modal";
import { useCreateHistoricalForm } from "../../../../form/commercial/account/historical/create/use-create.historical.form";
import { useCreateAnnexHistoricalModal } from "../../../../modal/comercial/account-attachments/create/annex-historical/use-annex-historical.create.commercial.modal";
import { useState } from "react";
import { IHistorical } from "@/app/lib/@backend/domain";

interface Props {
    accountId: string;
    historical: IHistorical[]
}

export function HistoricalDataPage({ historical, accountId }:Props) {
    const [file, setFile] = useState<{ name: string; url: string; id: string }>();
    
    const {
      handleDownload,
    } = useCreateHistoricalForm({accountId})

    const { 
      open, 
      closeModal, 
      openModal
    } = useCreateAnnexHistoricalModal()


    return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6">
      <CreateHistoricalForm
        historical={historical ?? []}
        accountId={accountId}
        openModalAnnex={openModal}
        closeModalAnnex={closeModal}
        file={file}
        setFile={setFile}
      />

      <TimelineItem
        onClickButtonDownload={(id: string, name: string) =>
            handleDownload(id, name)
        }
        historical={historical}
      />

      <CreateAnnexHistoricalModal
          closeModal={closeModal}
          onFileUploadSuccess={(name, url, id) => {
            setFile({ name, url, id });
            closeModal();
          }}
          open={open}
      
          accountId={accountId}
      />
    </div>
    )
}
