// src/app/lib/@frontend/ui/modal/CreateAnnexHistoricalForm.tsx
"use client";

import { Button } from '@/frontend/ui/component/button';
import { Input } from '@/frontend/ui/component/input';

import { DocumentArrowUpIcon, PaperClipIcon } from "@heroicons/react/20/solid";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import { useCreateAnnexHistoricalForm } from "./use-create-historical.annex.form";

interface CreateAnnexHistoricalFormProps {
    accountId: string;
    closeModal: () => void;
    handleFileUploadSuccess: (name: string, url: string, id: string) => void
}

export function CreateAnnexHistoricalForm({
    accountId,
    closeModal,
    handleFileUploadSuccess
}: CreateAnnexHistoricalFormProps) {
    const {
        register,
        handleFileChange,
        selectedFile,
        onSubmit,
        errors,
        isUploading,
    } = useCreateAnnexHistoricalForm({ accountId, closeModal, handleFileUploadSuccess });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const openFilePicker = () => fileInputRef.current?.click();

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex gap-4 items-end">
                <Input
                    label="Nome do Arquivo"
                    {...register("name")}
                    error={errors.name?.message}
                />
                <Button
                    variant="ghost"
                    type="button"
                    onClick={openFilePicker}
                    title="Selecionar arquivo"
                >
                    <PaperClipIcon className="h-5 w-5 text-gray-400" />
                </Button>
                <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="
                        application/pdf,
                        application/msword,
                        application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                        application/vnd.ms-excel,
                        application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                        .pdf,
                        .doc,
                        .docx,
                        .xls,
                        .xlsx,
                        image/*
                    "
                />
            </div>

            {errors.file && (
                <p className="text-sm text-red-500">{errors.file.message}</p>
            )}

            {selectedFile && (
                <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                    <DocumentArrowUpIcon className="h-5 w-5 text-gray-500" />
                    <span className="flex-1 truncate">{selectedFile.name}</span>
                    <span className="text-xs text-gray-500">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                    </span>
                </div>
            )}

            <div className="flex justify-end gap-4 mt-4">
                <Button
                    variant="ghost"
                    type="button"
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
