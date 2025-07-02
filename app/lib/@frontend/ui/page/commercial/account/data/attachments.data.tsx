"use client"
import { FolderOpenIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Button } from "../../../../component/button";
import { Input } from "../../../../component/input";
import { CreateAnnexModal } from "../../../../modal/comercial/account-attachments/create/annex/annex.create.commercial.modal";
import { AccountAttachmentsTable } from "../../../../table/commercial/account/accountAttachments/table";
import { IAccountAttachment } from "@/app/lib/@backend/domain/commercial/entity/account-attachment.definition";
import { useEffect, useState } from "react";
import { useCreateAnnexModal } from "../../../../modal/comercial/account-attachments/create/annex/use-annex.create.commercial.modal";

interface Props {
  attachments: IAccountAttachment[];
  accountId: string
}

export function AttachmentsDataPage({ attachments, accountId}: Props) {
  const {
    openModal,
    open,
    closeModal
  } = useCreateAnnexModal();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAttachments, setFilteredAttachments] = useState<IAccountAttachment[]>(attachments);


  useEffect(() => {
    setFilteredAttachments(attachments);
  }, [attachments]);

  const handleDelete = async (id: string) => {
    const newAttachments = filteredAttachments.filter((a) => a.id !== id);
    setFilteredAttachments(newAttachments);
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredAttachments(attachments);
      return;
    }

    const filtered = attachments.filter((attachment) =>
      attachment.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAttachments(filtered);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleModalClose = () => {
    closeModal();
  };

  return (
    <div className="grid grid-cols-2 flex-col gap-4">
      <div className="flex items-end justify-between col-span-2 w-full">
        <div className="flex gap-2 items-end w-2/4">
          <Input
            label="Nome do Arquivo"
            placeholder="Digite o nome do arquivo"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Button type="button" className="rounded-full" onClick={handleSearch}>
            <MagnifyingGlassIcon className="text-white w-4 h-4" /> Pesquisar
          </Button>
        </div>
        <Button onClick={openModal}>
          <FolderOpenIcon className="text-white w-4 h-4" /> Anexar
        </Button>
      </div>

      <div className="col-span-2">
        <AccountAttachmentsTable
          data={filteredAttachments}
          onDelete={handleDelete}
        />
      </div>
      <CreateAnnexModal
        open={open}
        accountId={accountId}
        closeModal={handleModalClose}
      />
    </div>
  )
}
