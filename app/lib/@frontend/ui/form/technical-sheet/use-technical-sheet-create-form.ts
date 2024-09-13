import { createOneTechnicalSheet } from "@/app/lib/@backend/action";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string({ required_error: "Nome não pode ser vazio" }),
  inputs: z.array(
    z.object({
      uuid: z.string(),
      quantity: z.number(),
    })
  ),
  product_id: z.string(),
});

export type Schema = z.infer<typeof schema>;

export function useTechnicalSheetCreateForm() {
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,
    setValue,
    reset: hookFormReset,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      inputs: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "inputs",
  });

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      await createOneTechnicalSheet({ ...data });

      toast({
        title: "Sucesso!",
        description: "Ficha técnica registrada com sucesso!",
        variant: "success",
      });
    } catch (e) {
      toast({
        title: "Erro!",
        description: "Falha ao registrar ficha técnica!",
        variant: "error",
      });
    }
  });

  const handleAppendInput = () => {
    append({
      uuid: "",
      quantity: 0,
    });
  };

  const handleRemoveInput = (stepIndex: number) => {
    remove(stepIndex);
  };

  const handleUpdateInput = ({
    quantity,
    stepIndex,
    uuid,
  }: {
    uuid: string;
    quantity?: number;
    stepIndex: number;
  }) => {
    update(stepIndex, {
      quantity: quantity ?? 0,
      uuid,
    });
  };

  return {
    register,
    handleSubmit,
    errors,
    control,
    setValue,
    reset: hookFormReset,
    inputsFields: fields,
    handleAppendInput,
    handleRemoveInput,
    handleUpdateInput,
  };
}
