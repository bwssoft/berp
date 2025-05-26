"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Base, IMovement, Item, Movement } from "@/app/lib/@backend/domain";
import { createManyMovement } from "@/app/lib/@backend/action";
import { toast } from "@/app/lib/@frontend/hook";

const movementSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
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
  order: z.number().default(0),
});

const movementBlockSchema = z.object({
  id: z.string(),
  type: z.enum(["RELATED", "INDEPENDENT"]),
  title: z.string(),
  movements: z
    .array(movementSchema)
    .min(1, "Adicione pelo menos uma movimentação"),
});

const movementFormSchema = z.object({
  blocks: z
    .array(movementBlockSchema)
    .min(1, "Adicione pelo menos um bloco de movimentações"),
});

export type CreateMovementFormData = z.infer<typeof movementFormSchema>;
export type MovementFormItem = z.infer<typeof movementSchema>;
export type MovementBlock = z.infer<typeof movementBlockSchema>;

export function useCreateMovementForm() {
  const methods = useForm<CreateMovementFormData>({
    resolver: zodResolver(movementFormSchema),
    defaultValues: {
      blocks: [
        {
          id: crypto.randomUUID(),
          type: "INDEPENDENT",
          title: "Movimentações independentes",
          movements: [
            {
              id: crypto.randomUUID(),
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
      ],
    },
  });

  const {
    fields: blocks,
    append: appendBlock,
    remove: removeBlock,
  } = useFieldArray({
    control: methods.control,
    name: "blocks",
  });

  // Função para adicionar novo bloco de sequência relacionada
  const addRelatedBlock = () => {
    const relatedCount = blocks.filter(
      (block) =>
        methods.getValues(`blocks.${blocks.indexOf(block)}.type`) === "RELATED"
    ).length;

    appendBlock({
      id: crypto.randomUUID(),
      type: "RELATED",
      title: `Sequência ${relatedCount + 1}`,
      movements: [
        {
          id: crypto.randomUUID(),
          item: undefined as unknown as MovementFormItem["item"],
          base: undefined as unknown as MovementFormItem["base"],
          quantity: 1,
          status: Movement.Status.PENDING,
          type: Movement.Type.ENTER,
          description: "",
          order: 0,
        },
      ],
    });
  };

  // Função para adicionar novo bloco de movimentações independentes
  const addIndependentBlock = () => {
    appendBlock({
      id: crypto.randomUUID(),
      type: "INDEPENDENT",
      title: "Movimentações independentes",
      movements: [
        {
          id: crypto.randomUUID(),
          item: undefined as unknown as MovementFormItem["item"],
          base: undefined as unknown as MovementFormItem["base"],
          quantity: 1,
          status: Movement.Status.PENDING,
          type: Movement.Type.ENTER,
          description: "",
          order: 0,
        },
      ],
    });
  };

  // Função para adicionar movimentação a um bloco específico
  const addMovementToBlock = (blockIndex: number) => {
    const currentMovements = methods.getValues(
      `blocks.${blockIndex}.movements`
    );
    const newOrder = currentMovements.length;

    const newMovement = {
      id: crypto.randomUUID(),
      item: undefined as unknown as MovementFormItem["item"],
      base: undefined as unknown as MovementFormItem["base"],
      quantity: 1,
      status: Movement.Status.PENDING,
      type: Movement.Type.ENTER,
      description: "",
      order: newOrder,
    };

    methods.setValue(`blocks.${blockIndex}.movements`, [
      ...currentMovements,
      newMovement,
    ]);
  };

  // Função para remover movimentação de um bloco específico
  const removeMovementFromBlock = (
    blockIndex: number,
    movementIndex: number
  ) => {
    const currentMovements = methods.getValues(
      `blocks.${blockIndex}.movements`
    );

    if (currentMovements.length > 1) {
      const updatedMovements = currentMovements.filter(
        (_, index) => index !== movementIndex
      );
      // Reordenar os índices
      const reorderedMovements = updatedMovements.map((movement, index) => ({
        ...movement,
        order: index,
      }));
      methods.setValue(`blocks.${blockIndex}.movements`, reorderedMovements);
    }
  };

  // Função para reordenar movimentações dentro de um bloco (apenas para RELATED)
  const reorderMovementsInBlock = (
    blockIndex: number,
    fromIndex: number,
    toIndex: number
  ) => {
    const currentMovements = methods.getValues(
      `blocks.${blockIndex}.movements`
    );
    const reorderedMovements = [...currentMovements];
    const [removed] = reorderedMovements.splice(fromIndex, 1);
    reorderedMovements.splice(toIndex, 0, removed);

    // Atualizar ordem
    const updatedMovements = reorderedMovements.map((movement, index) => ({
      ...movement,
      order: index,
    }));

    methods.setValue(`blocks.${blockIndex}.movements`, updatedMovements);
  };

  // Função para remover bloco inteiro
  const removeMovementBlock = (blockIndex: number) => {
    if (blocks.length > 1) {
      removeBlock(blockIndex);
    }
  };

  // Calcular total de movimentações
  const getTotalMovements = () => {
    return blocks.reduce((total, _, blockIndex) => {
      const movements =
        methods.getValues(`blocks.${blockIndex}.movements`) || [];
      return total + movements.length;
    }, 0);
  };

  const onSubmit = async (data: CreateMovementFormData) => {
    try {
      const movements: IMovement[] = [];

      data.blocks.forEach((block) => {
        const isRelated = block.type === "RELATED";

        block.movements.forEach((movement, index) => {
          const currentId = movement.id; // Aproveita o ID já existente

          const previousId =
            isRelated && index > 0 ? block.movements[index - 1].id : undefined;

          const nextId =
            isRelated && index < block.movements.length - 1
              ? block.movements[index + 1].id
              : undefined;

          const movementObj: IMovement = {
            id: currentId,
            seq: movements.length + 1, // Sequencial global
            item: {
              id: movement.item.id,
              type: movement.item.type,
              ref: {
                id: movement.item.ref.id,
                sku: movement.item.ref.sku,
                category: { id: movement.item.ref.category.id },
              },
            },
            quantity: movement.quantity,
            type: movement.type,
            base: {
              id: movement.base.id,
              sku: movement.base.sku,
              type: movement.base.type,
            },
            status: movement.status,
            created_at: new Date(),
            description: movement.description || undefined,
            related_movement_id: isRelated
              ? {
                  previous: previousId,
                  next: nextId,
                }
              : undefined,
          };

          movements.push(movementObj);
        });
      });

      const { success, error } = await createManyMovement(movements);

      if (success) {
        toast({
          title: "Sucesso!",
          description: `${movements.length} movimentação${movements.length > 1 ? "ões" : ""} registrada${movements.length > 1 ? "s" : ""} com sucesso!`,
          variant: "success",
        });
        return;
      }

      if (error) {
        toast({
          title: "Erro!",
          description: error.usecase ?? "Falha ao registrar as movimentações!",
          variant: "error",
        });
      }
    } catch {
      toast({
        title: "Erro!",
        description: "Falha ao registrar as movimentações!",
        variant: "error",
      });
    }
  };

  return {
    methods,
    blocks,
    addRelatedBlock,
    addIndependentBlock,
    addMovementToBlock,
    removeMovementFromBlock,
    reorderMovementsInBlock,
    removeMovementBlock,
    getTotalMovements,
    onSubmit: methods.handleSubmit(onSubmit),
    schema: movementFormSchema,
  };
}
