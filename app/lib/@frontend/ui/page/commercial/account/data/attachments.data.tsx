"use client"
import { CreateAnnexModal } from "../../../../modal/comercial/account-attachments/create/annex/annex.create.commercial.modal";
import { AccountAttachmentsTable } from "../../../../table/commercial/account/accountAttachments/table";
import { IAccountAttachment } from "@/app/lib/@backend/domain/commercial/entity/account-attachment.definition";
import { useCreateAnnexModal } from "../../../../modal/comercial/account-attachments/create/annex/use-annex.create.commercial.modal";
import { SearchAttachmentsForm } from "../../../../form/commercial/account/account-attachments/search/search-attachments.annex.form";
import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";

interface Props {
  attachments: PaginationResult<IAccountAttachment>;
  accountId: string
  hasPermission: boolean
}

export function AttachmentsDataPage({ attachments, accountId, hasPermission }: Props) {
  const {
    open,
    closeModal,
    openModal
  } = useCreateAnnexModal();

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6">
      <SearchAttachmentsForm 
        openModal={openModal} 
      />
      <div className="col-span-2">
        <AccountAttachmentsTable
          data={attachments}
          hasPermission={hasPermission}
        />
      </div>
      <CreateAnnexModal
        open={open}
        accountId={accountId}
        closeModal={closeModal}
      />
    </div>
  )
}
