"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Base, Item, Movement } from "@/app/lib/@backend/domain";
import { createManyMovement } from "@/app/lib/@backend/action";
import { toast } from "@/app/lib/@frontend/hook";

const movementSchema = z.object({
  item: z.object({
    id: z.string(),
    type: z.nativeEnum(Item.Type),
    ref: z.object({
      id: z.string(),
      sku: z.string(),
      color: z.string(),
      category: z.object({ id: z.string() }),
    }),
  }),
  quantity: z.number().positive("Quantidade deve ser positiva"),
  base: z.object({
    id: z.string(),
    sku: z.string(),
    type: z.nativeEnum(Base.Type),
  }),
  status: z.nativeEnum(Movement.Status),
  type: z.nativeEnum(Movement.Type),
  description: z.string().optional(),
});

const movementFormSchema = z.object({
  movements: z
    .array(movementSchema)
    .min(1, "Adicione pelo menos uma movimentação"),
});

export type CreateMovementFormData = z.infer<typeof movementFormSchema>;
export type Movement = z.infer<typeof movementSchema>;

export function useCreateMovementForm() {
  const methods = useForm<CreateMovementFormData>({
    resolver: zodResolver(movementFormSchema),
    defaultValues: {
      movements: [
        {
          item: undefined as unknown as Movement["item"],
          base: undefined as unknown as Movement["base"],
          quantity: 0,
          status: Movement.Status.PENDING,
          type: Movement.Type.ENTER,
          description: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "movements",
  });

  const addMovement = () => {
    append({
      item: undefined as unknown as Movement["item"],
      base: undefined as unknown as Movement["base"],
      quantity: 1,
      status: Movement.Status.PENDING,
      type: Movement.Type.ENTER,
      description: "",
    });
  };

  const removeMovement = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onSubmit = async ({ movements }: CreateMovementFormData) => {
    try {
      const { success, error } = await createManyMovement(movements);

      if (success) {
        toast({
          title: "Sucesso!",
          description: "Movimentação registrada com sucesso!",
          variant: "success",
        });
        return;
      }

      if (error) {
        toast({
          title: "Erro!",
          description: error.usecase ?? "Falha ao registrar a movimentação!",
          variant: "error",
        });
      }
    } catch {
      toast({
        title: "Erro!",
        description: "Falha ao registrar a movimentação!",
        variant: "error",
      });
    }
  };

  return {
    methods,
    fields,
    addMovement,
    removeMovement,
    onSubmit: methods.handleSubmit(onSubmit),
    schema: movementFormSchema,
  };
}
