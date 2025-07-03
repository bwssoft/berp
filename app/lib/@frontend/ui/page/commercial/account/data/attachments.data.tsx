"use client"
import { CreateAnnexModal } from "../../../../modal/comercial/account-attachments/create/annex/annex.create.commercial.modal";
import { AccountAttachmentsTable } from "../../../../table/commercial/account/accountAttachments/table";
import { IAccountAttachment } from "@/app/lib/@backend/domain/commercial/entity/account-attachment.definition";
import { useCreateAnnexModal } from "../../../../modal/comercial/account-attachments/create/annex/use-annex.create.commercial.modal";
import { useSearchAttachmentsAnnexForm } from "../../../../form/commercial/account/account-attachments/search/use-search-attachments.annex.form";
import { SearchAttachmentsForm } from "../../../../form/commercial/account/account-attachments/search/search-attachments.annex.form";

interface Props {
  attachments: IAccountAttachment[];
  accountId: string
}

export function AttachmentsDataPage({ attachments, accountId}: Props) {
  const {
    open,
    closeModal,
    openModal
  } = useCreateAnnexModal();

  const {
    filteredAttachments,
    handleDelete,
    handleSearch,
    handleSearchChange,
    searchTerm
  } = useSearchAttachmentsAnnexForm({attachments})

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6">
      <SearchAttachmentsForm 
        openModal={openModal} 
        handleSearch={handleSearch}
        handleSearchChange={handleSearchChange}
        searchTerm={searchTerm}
      />
      <div className="col-span-2">
        <AccountAttachmentsTable
          data={filteredAttachments}
          onDelete={handleDelete}
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
