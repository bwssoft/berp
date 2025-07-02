import { Button } from "@/app/lib/@frontend/ui/component/button";
import { Input } from "@/app/lib/@frontend/ui/component/input";
import { FolderOpenIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchAttachmentsAnnexForm } from "./use-search-attachments.annex.form";
import { IAccountAttachment } from "@/app/lib/@backend/domain";

interface Props {
  openModal: () => void;
  searchTerm: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearch: () => void;
}

export function SearchAttachmentsForm({openModal, searchTerm, handleSearch, handleSearchChange}:Props) {

    return (
        <form className="w-full flex justify-between items-end">
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
        </form>
    )
}