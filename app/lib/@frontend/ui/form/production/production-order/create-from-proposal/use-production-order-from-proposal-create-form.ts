import { updateOneProductionOrderById } from "@/app/lib/@backend/action";
import { IProductionOrder } from "@/app/lib/@backend/domain"
import { toast } from "@/app/lib/@frontend/hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

interface Props {
  defaultValues?: IProductionOrder
}

const LineItemSchema = z.object({
  configuration_profile_id: z.string().optional(),
  parcial_quantity: z.coerce.number(),
  is_shared: z.boolean(),
  id: z.string(),
});

export const schema = z.object({
  client_id: z.string(),
  proposal_id: z.string().optional(),
  financial_order_id: z.string().optional(),
  description: z.string().optional(),
  line_items: z.array(LineItemSchema),
  product_id: z.string(),
  total_quantity: z.number(),
  production_process_id: z.string().optional(),
  production_execution_id: z.string().optional(),
}).superRefine((data, ctx) => {
  const totalParcialQuantity = data.line_items.reduce(
    (sum, item) => sum + item.parcial_quantity,
    0
  );

  if (totalParcialQuantity !== data.total_quantity) {
    data.line_items.forEach((_, index) => {
      ctx.addIssue({
        code: "custom",
        message: `A soma das quantidades deve ser ${data.total_quantity}.`,
        path: ["line_items", index, "parcial_quantity"],
      });
    });
  }
});

type Schema = z.infer<typeof schema>;

export function useCreateProductionOrderCreateFromProposal(props: Props) {
  const { defaultValues } = props
  const {
    register,
    control,
    handleSubmit: hookFormSubmit,
    reset,
    formState: { errors }
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues
  });

  const { fields: lineItemsOnForm, append, remove } = useFieldArray({
    control,
    name: "line_items",
    keyName: "key"
  });
  const handleAppendLineItem = append
  const handleRemoveLineItem = remove

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      await updateOneProductionOrderById({ id: defaultValues?.id! }, data);
      toast({
        title: 'Sucesso!',
        description: 'Ordem de produção atualizada com sucesso!',
        variant: 'success',
      });
    } catch (e) {
      toast({
        title: 'Erro!',
        description: 'Falha ao atualizar a ordem de produção!',
        variant: 'error',
      });
    }
  });

  useEffect(() => reset(defaultValues), [defaultValues, reset])

  return {
    handleSubmit,
    register,
    lineItemsOnForm,
    handleAppendLineItem,
    handleRemoveLineItem,
    errors, 
    control
  }
}