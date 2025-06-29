import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/app/lib/@frontend/hook";
import { createOneProduct } from "@/app/lib/@backend/action/engineer/product/product.action";

const schema = z.object({
  name: z
    .string({ required_error: "Esse campo não pode ser vazio" })
    .min(1, "Esse campo não pode ser vazio"),
  description: z
    .string({ required_error: "Esse campo não pode ser vazio" })
    .min(1, "Esse campo não pode ser vazio"),
  color: z.string(),
  category: z.string(),
  price: z.coerce.number().nonnegative(),
  files: z.array(z.any()).default([]),
  bom: z
    .array(z.object({ input_id: z.string(), quantity: z.coerce.number() }))
    .default([]),
  process_execution: z
    .array(z.object({ id: z.string(), step: z.string() }))
    .default([]),
  technology_id: z.string(),
});

export type Schema = z.infer<typeof schema>;

export function useProductCreateForm() {
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,
    setValue,
    reset: hookFormReset,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const {
    fields: bom,
    append: handleAppendBom,
    remove: handleRemoveBom,
  } = useFieldArray({
    control,
    name: "bom",
  });

  const {
    fields: process_execution,
    append: handleAppendProcessToProduce,
    remove: handleRemoveProcessToProduce,
  } = useFieldArray({
    control,
    name: "process_execution",
  });

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      //fazer a request
      await createOneProduct(data);
      toast({
        title: "Sucesso!",
        description: "Produto registrado com sucesso!",
        variant: "success",
      });
    } catch (e) {
      toast({
        title: "Erro!",
        description: "Falha ao registrar o produto!",
        variant: "error",
      });
    }
  });

  return {
    register,
    handleSubmit,
    errors,
    control,
    setValue,
    reset: hookFormReset,

    bom,
    handleAppendBom,
    handleRemoveBom,

    process_execution,
    handleAppendProcessToProduce,
    handleRemoveProcessToProduce,
  };
}
