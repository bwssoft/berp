"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createOneComponentCategory } from "@/app/lib/@backend/action";
import { useRouter } from "next/navigation";
import { toast } from "@/app/lib/@frontend/hook";

// Schema de validação com Zod
const schema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Quantidade de caracteres excedida (100)"),
  code: z
    .string()
    .min(1, "Código é obrigatório")
    .max(15, "Quantidade de caracteres excedida (15)"),
});

export type CreateComponentCategoryFormData = z.infer<typeof schema>;

export function useCreateOneComponentCategoryForm() {
  const router = useRouter();

  const form = useForm<CreateComponentCategoryFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      code: "",
    },
  });

  const handleSubmit = form.handleSubmit(
    async (data: CreateComponentCategoryFormData) => {
      try {
        const { success, error } = await createOneComponentCategory(data);

        if (success) {
          toast({
            title: "Sucesso!",
            description: "Categoria registrada com sucesso!",
            variant: "success",
          });
          router.push("/engineer/component/category");
          return;
        }

        if (error) {
          Object.entries(error).forEach(([key, message]) => {
            if (key !== "global" && message) {
              form.setError(key as keyof CreateComponentCategoryFormData, {
                type: "manual",
                message: message as string,
              });
            }
          });
          toast({
            title: "Erro!",
            description: error.usecase ?? "Falha ao registrar o componente!",
            variant: "error",
          });
        }
      } catch (error) {
        toast({
          title: "Erro!",
          description: "Falha ao registrar o componente!",
          variant: "error",
        });
      }
    }
  );

  function handleCancel() {
    router.push("/engineer/component/category");
  }

  return {
    form,
    handleSubmit,
    schema: schema,
    handleCancel,
  };
}
