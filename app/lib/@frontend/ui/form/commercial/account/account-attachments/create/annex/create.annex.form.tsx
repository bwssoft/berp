"use client";
import { Button, Input } from "@/app/lib/@frontend/ui/component";
import { useCreateAnnexForm } from "./use-create.annex.form";
import { DocumentArrowUpIcon, PaperClipIcon } from "@heroicons/react/20/solid";
import { ArrowPathIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";

interface CreateAnnexFormProps {
  closeModal: () => void;
  accountId: string
}

export function CreateAnnexForm({ closeModal, accountId }: CreateAnnexFormProps) {
  const {
    register,
    onSubmit,
    errors,
    handleFileChange,
    selectedFile,
    isUploading,
  } = useCreateAnnexForm({ closeModal, accountId });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex gap-4 items-end">
        <Input
          label="Nome do Arquivo"
          {...register("name")}
          error={errors.name?.message}
        />
        <Button
          variant={"ghost"}
          type="button"
          onClick={handleButtonClick}
          title="Selecionar arquivo"
        >
          <PaperClipIcon className="h-5 w-5 text-gray-400" />
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        />
      </div>

      {errors.file && (
        <div className="text-sm text-red-500">{errors.file.message}</div>
      )}

      {selectedFile && (
        <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
          <DocumentArrowUpIcon className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-700 flex-1 truncate">
            {selectedFile.name}
          </span>
          <span className="text-xs text-gray-500">
            {(selectedFile.size / 1024).toFixed(1)} KB
          </span>
        </div>
      )}

      <div className="flex gap-4 justify-end mt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={closeModal}
          disabled={isUploading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isUploading}>
          {isUploading ? (
            <>
              <ArrowPathIcon className="h-4 w-4 animate-spin mr-2" />
              Enviando...
            </>
          ) : (
            "Salvar"
          )}
        </Button>
      </div>
    </form>
  );
}
