"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Base, Item, Movement } from "@/app/lib/@backend/domain";
import { createManyMovement } from "@/app/lib/@backend/action";
import { toast } from "@/app/lib/@frontend/hook";

const movementSchema = z.object({
  id: z.string().default(() => Math.random().toString(36).substr(2, 9)),
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
  order: z.number().default(0), // Ordem da movimentação na sequência
});

const movementFormSchema = z.object({
  movements: z
    .array(movementSchema)
    .min(1, "Adicione pelo menos uma movimentação"),
});

export type CreateMovementFormData = z.infer<typeof movementFormSchema>;
export type MovementFormItem = z.infer<typeof movementSchema>;

export function useCreateMovementForm() {
  const methods = useForm<CreateMovementFormData>({
    resolver: zodResolver(movementFormSchema),
    defaultValues: {
      movements: [
        {
          id: Math.random().toString(36).substr(2, 9),
          item: undefined as unknown as MovementFormItem["item"],
          base: undefined as unknown as MovementFormItem["base"],
          quantity: 0,
          status: Movement.Status.PENDING,
          type: Movement.Type.ENTER,
          description: "",
          order: 0,
        },
      ],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: methods.control,
    name: "movements",
  });

  const addMovement = () => {
    const newOrder = fields.length;
    append({
      id: Math.random().toString(36).substr(2, 9),
      item: undefined as unknown as MovementFormItem["item"],
      base: undefined as unknown as MovementFormItem["base"],
      quantity: 1,
      status: Movement.Status.PENDING,
      type: Movement.Type.ENTER,
      description: "",
      order: newOrder,
    });
  };

  const removeMovement = (index: number) => {
    if (fields.length > 1) {
      remove(index);
      // Reordenar os índices após remoção
      updateOrderIndexes();
    }
  };

  const reorderMovements = (fromIndex: number, toIndex: number) => {
    move(fromIndex, toIndex);
    updateOrderIndexes();
  };

  const updateOrderIndexes = () => {
    const movements = methods.getValues("movements");
    movements.forEach((_, index) => {
      methods.setValue(`movements.${index}.order`, index);
    });
  };

  const onSubmit = async ({ movements }: CreateMovementFormData) => {
    try {
      const movementsToSubmit = movements.map(({ id, ...movement }, index) => ({
        ...movement,
        sequencePosition: index + 1,
        previousMovement: index > 0 ? movements[index - 1].id : null,
        nextMovement:
          index < movements.length - 1 ? movements[index + 1].id : null,
      }));
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
    reorderMovements,
    onSubmit: methods.handleSubmit(onSubmit),
    schema: movementFormSchema,
  };
}
