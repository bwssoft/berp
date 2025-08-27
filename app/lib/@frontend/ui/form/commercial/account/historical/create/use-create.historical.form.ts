"use client";

import { downloadAccountAttachmentHistorical } from "@/app/lib/@backend/action/commercial/account-attachment-historical.download.action";
import { deleteAccountAttachment } from "@/app/lib/@backend/action/commercial/account-attachment.delete.action";
import { createOneHistorical } from "@/app/lib/@backend/action/commercial/historical.action";
import { ContactSelection } from "@/app/lib/@backend/domain";
import { useAuth } from "@/app/lib/@frontend/context";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  description: z.string().min(1, "Descrição é obrigatório"),
});

type CreateHistoricalFormSchema = z.infer<typeof schema>;

type Props = {
  accountId: string;
  closeModalAnnex?: () => void;
  file?: { name: string; url: string; id: string };
  setFile?: Dispatch<
    SetStateAction<
      | {
          name: string;
          url: string;
          id: string;
        }
      | undefined
    >
  >;
};

export function useCreateHistoricalForm({
  accountId,
  closeModalAnnex,
  file,
  setFile,
}: Props) {
  const {
    handleSubmit,
    register,
    reset,
    formState: errors,
  } = useForm<CreateHistoricalFormSchema>({
    resolver: zodResolver(schema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectContact, setSelectContact] = useState<ContactSelection>();

  const { user } = useAuth();

  const queryClient = useQueryClient();

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      await createOneHistorical({
        ...data,
        accountId: accountId,
        title: "Histórico Manual",
        type: "manual",
        description: data.description,
        author: {
          name: user?.name ?? "",
          avatarUrl: user?.avatarUrl ?? "",
        },
        file: file,
        contacts: selectContact,
      });

      queryClient.invalidateQueries({
        queryKey: [accountId, "historical"],
      });
    } finally {
      setIsLoading(false);
      closeModalAnnex?.();
      reset();
      setSelectContact(undefined); // Reset selected contact after form submission
      setFile?.(undefined); // Reset selected file after form submission
    }
  });

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

  const onHandleRemoveFile = async () => {
    if (setFile && file) {
      setFile(undefined);
      await deleteAccountAttachment(file?.id);
    }
  };

  return {
    onSubmit,
    register,
    file,
    setSelectContact,
    selectContact,
    errors,
    handleDownload,
    isLoading,
    onHandleRemoveFile,
  };
}
