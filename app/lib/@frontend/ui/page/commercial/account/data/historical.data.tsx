"use client";

import { useQuery } from "@tanstack/react-query";
import { findManyHistorical } from "@/app/lib/@backend/action/commercial/historical.action";
import { CreateHistoricalForm } from "../../../../form/commercial/account/historical/create/create.historical.form";
import { TimelineItem } from "../../../../list/commercial/historical/time-line-item";
import { CreateAnnexHistoricalModal } from "../../../../modal/comercial/account-attachments/create/annex-historical/annex-historical.create.commercial.modal";
import { useCreateHistoricalForm } from "../../../../form/commercial/account/historical/create/use-create.historical.form";
import { useCreateAnnexHistoricalModal } from "../../../../modal/comercial/account-attachments/create/annex-historical/use-annex-historical.create.commercial.modal";

interface Props {
    accountId: string;
}

export function HistoricalDataPage({ accountId }: Props) {
    const { data: historicalData } = useQuery({
        queryKey: ["findManyHistorical", accountId],
        queryFn: () => findManyHistorical({ accountId }),
    });

    const { handleDownload, handleFileChange, open } = useCreateHistoricalForm({
        accountId,
    });

    const { closeModal } = useCreateAnnexHistoricalModal();

    return (
        <div className="flex flex-col items-center">
            <CreateHistoricalForm accountId={accountId} />
            <TimelineItem
                onClickButtonDownload={(id: string, name: string) =>
                    handleDownload(id, name)
                }
                historical={historicalData?.docs ?? []}
            />
            <CreateAnnexHistoricalModal
                closeModal={closeModal}
                onFileUploadSuccess={handleFileChange}
                open={open}
                accountId={accountId}
            />
        </div>
    );
}
