"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { createOneInputCategory } from "@/app/lib/@backend/action/engineer/input/input.category.action";

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

export type CreateInputCategoryFormData = z.infer<typeof schema>;

export function useCreateOneInputCategoryForm() {
  const router = useRouter();

  const form = useForm<CreateInputCategoryFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      code: "",
    },
  });

  const handleSubmit = form.handleSubmit(
    async (data: CreateInputCategoryFormData) => {
      try {
        const { success, error } = await createOneInputCategory(data);

        if (success) {
          toast({
            title: "Sucesso!",
            description: "Categoria registrada com sucesso!",
            variant: "success",
          });
          router.push("/engineer/input/category");
          return;
        }

        if (error) {
          Object.entries(error).forEach(([key, message]) => {
            if (key !== "global" && message) {
              form.setError(key as keyof CreateInputCategoryFormData, {
                type: "manual",
                message: message as string,
              });
            }
          });
          toast({
            title: "Erro!",
            description: error.usecase ?? "Falha ao registrar o insumo!",
            variant: "error",
          });
        }
      } catch (error) {
        toast({
          title: "Erro!",
          description: "Falha ao registrar o insumo!",
          variant: "error",
        });
      }
    }
  );

  function handleCancel() {
    router.push("/engineer/input/category");
  }

  return {
    form,
    handleSubmit,
    schema: schema,
    handleCancel,
  };
}
