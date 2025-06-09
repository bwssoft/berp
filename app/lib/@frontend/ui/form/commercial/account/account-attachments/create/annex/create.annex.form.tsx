"use client";
import { Button, Input } from "@/app/lib/@frontend/ui/component";
import { useCreateAnnexForm } from "./use-create.annex.form";
import { PaperClipIcon } from "@heroicons/react/20/solid";

interface CreateAnnexFormProps {
  closeModal: () => void;
}

export function CreateAnnexForm({ closeModal }: CreateAnnexFormProps) {
  const { register, onSubmit, errors } = useCreateAnnexForm({ closeModal });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex gap-4 items-end bg-yellow-600">
        <Input
          label="Nome do Arquivo"
          {...register("name")}
          error={errors.name?.message}
        />
        <Button variant={"ghost"} type="button">
          <PaperClipIcon className="h-5 w-5 text-gray-400" />
        </Button>
      </div>

      <div className="flex gap-4 justify-end mt-4">
        <Button type="button" variant="ghost">
          Cancelar
        </Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
}
