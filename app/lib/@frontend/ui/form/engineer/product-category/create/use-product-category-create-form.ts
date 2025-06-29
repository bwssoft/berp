import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/app/lib/@frontend/hook";
import { createOneProductCategory } from "@/app/lib/@backend/action/engineer/product/product-category.action";

const schema = z.object({
  name: z.string().min(1, "Esse campo não pode ser vazio"),
  code: z.string().min(1, "Esse campo não pode ser vazio"),
});

export type Schema = z.infer<typeof schema>;

export function useProductCategoryCreateForm() {
  const { register, handleSubmit: hookFormSubmit } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const handleSubmit = hookFormSubmit(async function onSuccess(data) {
    try {
      await createOneProductCategory(data);
      toast({
        title: "Sucesso!",
        description: "Categoria de produto registrada com sucesso!",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Falha ao registrar a categoria de produto!",
        variant: "error",
      });
    }
  });

  return {
    handleSubmit,
    register,
  };
}
