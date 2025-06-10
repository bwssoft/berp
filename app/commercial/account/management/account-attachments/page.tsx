"use client";
import { Button, Input } from "@/app/lib/@frontend/ui/component";
import {
  CreateAnnexModal,
  useCreateAnnexModal,
} from "@/app/lib/@frontend/ui/modal";
import { AccountAttachmentsTable } from "@/app/lib/@frontend/ui/table";
import { FolderOpenIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { findManyAccountAttachments } from "@/app/lib/@backend/action/commercial/account-attachment.find.action";
import { useEffect, useState } from "react";
import { IAccountAttachment } from "@/app/lib/@backend/domain";

export default function Page() {
  const { openModal, open, closeModal } = useCreateAnnexModal();
  const [searchTerm, setSearchTerm] = useState("");
  const [attachments, setAttachments] = useState<IAccountAttachment[]>([]);
  const [filteredAttachments, setFilteredAttachments] = useState<
    IAccountAttachment[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch attachments on load and after modal close
  useEffect(() => {
    const fetchAttachments = async () => {
      setIsLoading(true);
      try {
        const data = await findManyAccountAttachments();
        setAttachments(data);
        setFilteredAttachments(data);
      } catch (error) {
        console.error("Error fetching attachments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttachments();
  }, [open]);

  // Handle search
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

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle modal close with refresh
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
      <CreateAnnexModal open={open} closeModal={handleModalClose} />

      <div className="col-span-2">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <AccountAttachmentsTable data={filteredAttachments} />
        )}
      </div>
    </div>
  );
}
