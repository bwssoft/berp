"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Nome do anexo é obrigatório"),
});

export type CreateAnnexFormSchema = z.infer<typeof schema>;

interface CreateAnnexFormProps {
  closeModal: () => void;
}

export function useCreateAnnexForm({ closeModal }: CreateAnnexFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAnnexFormSchema>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    closeModal();
  });
  return {
    register,
    onSubmit,
    errors,
  };
}
