"use client"
import { Button } from "@/app/lib/@frontend/ui/component/button";
import { Input } from "@/app/lib/@frontend/ui/component/input";
import { FolderOpenIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchAttachmentsAnnexForm } from "./use-search-attachments.annex.form";

interface Props {
  openModal: () => void;
}

export function SearchAttachmentsForm({openModal}:Props) {
    const { register, onSubmit } = useSearchAttachmentsAnnexForm()

    return (
        <form onSubmit={onSubmit} className="w-full flex justify-between items-end">
            <div className="flex gap-2 items-end w-2/4">
                <Input
                    label="Nome do Arquivo"
                    placeholder="Digite o nome do arquivo"
                    {...register("name")}
                />
                <Button type="submit" className="rounded-full">
                  <MagnifyingGlassIcon className="text-white w-4 h-4" /> Pesquisar
                </Button>
            </div>
            <Button type="button" onClick={openModal}>
                <FolderOpenIcon className="text-white w-4 h-4" /> Anexar
            </Button>
        </form>
    )
}