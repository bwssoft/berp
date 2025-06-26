"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/app/lib/@frontend/hook";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { createAccountAttachmentHistorical } from "@/app/lib/@backend/action/commercial/account-attachment.historical.action";

const schema = z.object({
  name: z.string().min(1, "Nome do anexo é obrigatório"),
  file: z
    .instanceof(File, { message: "Arquivo é obrigatório" })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Arquivo deve ter no máximo 5MB",
    }),
});

export type CreateAnnexHistoricalFormSchema = z.infer<typeof schema>;

interface CreateAnnexFormProps {
  closeModal: () => void;
  onFileUploadSuccess?: (fileUrl: string) => void;
}

export function useCreateAnnexHistoricalForm({ closeModal, onFileUploadSuccess }: CreateAnnexFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFileUrl, setUploadFileUrl] = useState<string | undefined>()
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateAnnexHistoricalFormSchema>({
    resolver: zodResolver(schema),
  });

  const selectedFile = watch("file");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("file", file, { shouldValidate: true })
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

      const result = await createAccountAttachmentHistorical(fileData, {
        id: crypto.randomUUID(),
        name: data.name,
        accountId: ""
      });

      if (result.success) {
        if (onFileUploadSuccess && result.fileUrl) {
          onFileUploadSuccess(result.fileUrl);
        }
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar anexo",
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
    uploadFileUrl
  };
}