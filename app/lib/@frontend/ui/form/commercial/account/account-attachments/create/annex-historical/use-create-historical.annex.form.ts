// src/app/lib/@frontend/ui/modal/use-create-historical.annex.form.ts
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { useState } from "react";
import { useAuth } from "@/app/lib/@frontend/context";
import { useQueryClient } from "@tanstack/react-query";

import { createAccountAttachmentHistorical } from "@/app/lib/@backend/action/commercial/account-attachment.historical.action";
import { createOneHistorical } from "@/app/lib/@backend/action/commercial/historical.action";

const schema = z.object({
    name: z.string().min(1, "Nome do anexo é obrigatório"),
    file: z
        .instanceof(File, { message: "Arquivo é obrigatório" })
        .refine((f) => f.size <= 5 * 1024 * 1024, {
            message: "Arquivo deve ter no máximo 5MB",
        }),
});

type FormData = z.infer<typeof schema>;

interface Props {
    accountId: string;
    closeModal: () => void;
}

export function useCreateAnnexHistoricalForm({ accountId, closeModal }: Props) {
    const [isUploading, setIsUploading] = useState(false);
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const selectedFile = watch("file");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setValue("file", f, { shouldValidate: true });
    };

    const onSubmit = handleSubmit(async (data) => {
        setIsUploading(true);
        try {
            // 1) carrega o arquivo na API de attachments
            const buffer = await data.file.arrayBuffer();
            const uploadPayload = {
                buffer: Array.from(new Uint8Array(buffer)),
                name: data.file.name,
                type: data.file.type,
                size: data.file.size,
            };
            const uploadResult = await createAccountAttachmentHistorical(
                uploadPayload,
                {
                    id: crypto.randomUUID(),
                    name: data.name,
                    accountId,
                }
            );

            if (!uploadResult.success) {
                throw new Error("Falha no upload");
            }

            // 2) já cria o histórico com o anexo
            await createOneHistorical({
                accountId,
                title: "Anexo de arquivo",
                type: "manual",
                description: "", // sem texto
                author: {
                    name: user?.name ?? "",
                    avatarUrl: user?.avatarUrl ?? "",
                },
                file: {
                    id: uploadResult.id!,
                    name: uploadResult.name,
                    url: uploadResult.fileUrl!,
                },
                contacts: undefined,
            });

            // 3) invalida e refaz a lista de históricos
            queryClient.invalidateQueries({
                queryKey: ["historicals", accountId],
            });

            // 4) fecha modal e limpa form
            reset();
            closeModal();
        } catch (err) {
            console.error(err);
            toast({
                title: "Erro",
                description: "Não foi possível carregar o anexo",
                variant: "error",
            });
        } finally {
            setIsUploading(false);
        }
    });

    return {
        register,
        handleFileChange,
        selectedFile,
        onSubmit,
        errors,
        isUploading,
    };
}
