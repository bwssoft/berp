"use client";
import { downloadAccountAttachmentHistorical } from "@/app/lib/@backend/action/commercial/account-attachment-historical.download.action";
import { createOneHistorical } from "@/app/lib/@backend/action/commercial/historical.action";
import { ContactSelection } from "@/app/lib/@backend/domain";
import { useAuth } from "@/app/lib/@frontend/context";
import { toast } from "@/app/lib/@frontend/hook";
import { useCreateAnnexHistoricalModal } from "@/app/lib/@frontend/ui/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
    description: z.string().min(1, "Descrição é obrigatório"),
});

type CreateHistoricalFormSchema = z.infer<typeof schema>;

type Props = {
    accountId: string;
};

export function useCreateHistoricalForm({ accountId }: Props) {
    const {
        handleSubmit,
        register,
        reset,
        formState: errors,
    } = useForm<CreateHistoricalFormSchema>({
        resolver: zodResolver(schema),
    });
    const { openModal, open, closeModal } = useCreateAnnexHistoricalModal();
    const { user } = useAuth();
    const [file, setFile] = useState<
        { name: string; url: string; id: string } | undefined
    >();
    const [selectContact, setSelectContact] = useState<ContactSelection>();
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();
    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);

        try {
            await createOneHistorical({
                ...data,
                accountId: accountId,
                title: "Histórico Manual de Conta",
                type: "manual",
                description: data.description,
                author: {
                    name: user?.name ?? "",
                    avatarUrl: "",
                },
                file: file,
                contacts: selectContact,
            });

            await queryClient.invalidateQueries({
                queryKey: ["findManyHistorical", accountId],
            });
            reset();
        } finally {
            setIsLoading(false);
        }
    });

    const handleFileChange = (name: string, url: string, id: string) => {
        setFile({
            name,
            url,
            id,
        });
        closeModal();
    };

    const handleDownload = async (id: string, name: string) => {
        try {
            if (!id) {
                toast({
                    title: "Erro",
                    description: "ID do anexo não encontrado",
                    variant: "error",
                });
                return;
            }

            toast({
                title: "Download iniciado",
                description: `Baixando ${name}...`,
                variant: "default",
            });

            const result = await downloadAccountAttachmentHistorical(id);
            console.log(result);

            if (result.success && result.data) {
                const uint8Array = new Uint8Array(result.data);
                const blob = new Blob([uint8Array], {
                    type: result.contentType,
                });
                const url = URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = url;
                link.download = name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                toast({
                    title: "Sucesso",
                    description: `${name} baixado com sucesso`,
                    variant: "success",
                });
            } else {
                throw new Error("Falha no retorno da API");
            }
        } catch (error) {
            console.error("Error downloading file:", error);
            toast({
                title: "Erro",
                description: "Falha ao fazer download do arquivo",
                variant: "error",
            });
        }
    };

    return {
        onSubmit,
        register,
        handleFileChange,
        file,
        openModal,
        open,
        setSelectContact,
        selectContact,
        closeModal,
        reset,
        errors,
        handleDownload,
        isLoading,
    };
}
