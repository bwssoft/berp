"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { createAccountAttachment } from "@/app/lib/@backend/action/commercial/account-attachment.action";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { createOneHistorical } from "@/app/lib/@backend/action/commercial/historical.action";
import { useAuth } from "@/app/lib/@frontend/context";

const schema = z.object({
  name: z.string().min(1, "Nome do anexo é obrigatório"),
  file: z
    .instanceof(File, { message: "Arquivo é obrigatório" })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "Arquivo deve ter no máximo 10MB",
    }),
});

export type CreateAnnexFormSchema = z.infer<typeof schema>;

interface CreateAnnexFormProps {
  closeModal: () => void;
  accountId: string;
}

export function useCreateAnnexForm({
  closeModal,
  accountId,
}: CreateAnnexFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateAnnexFormSchema>({
    resolver: zodResolver(schema),
  });

  const selectedFile = watch("file");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("file", file, { shouldValidate: true });
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsUploading(true);

      // Convert file to array buffer and create object with necessary metadata
      const fileBuffer = await data.file.arrayBuffer();
      const fileData = {
        buffer: Array.from(new Uint8Array(fileBuffer)),
        name: data.file.name,
        type: data.file.type,
        size: data.file.size,
      };

      const result = await createAccountAttachment(fileData, {
        id: crypto.randomUUID(),
        name: data.name,
        accountId: accountId,
      });

      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Anexo enviado com sucesso!",
          variant: "success",
        });
        await createOneHistorical({
          ...data,
          accountId: accountId,
          title: "Rotina de criação de um anexo.",
          type: "manual",
          description: `Criação do anexo ${data.name}`,
          author: {
            name: user?.name ?? "",
            avatarUrl: "",
          },
          file: fileData,
        });
        closeModal();
      } else {
        toast({
          title: "Erro",
          description: "Falha ao enviar anexo",
          variant: "error",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao enviar anexo",
        variant: "error",
      });
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  });

  return {
    register,
    onSubmit,
    errors,
    handleFileChange,
    selectedFile,
    isUploading,
  };
}
