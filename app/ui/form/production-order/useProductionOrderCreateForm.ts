import { toast } from '@/app/hook/use-toast';
import { createOneProductionOrder } from '@/app/lib/action/production-order.action';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  priority: z.enum(["high", "medium", "low"]),
  description: z.string().min(1, 'Esse campo não pode ser vazio'),
  files: z.any(),
  products: z.array(z.object({ product_id: z.string(), quantity: z.coerce.number() })),
});

export type Schema = z.infer<typeof schema>;

export function useProductionOrderCreateForm() {
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
  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      //fazer a request
      await createOneProductionOrder({ ...data, stage: "to_produce" });
      toast({
        title: "Sucesso!",
        description: "Order de produção registrada com sucesso!",
        variant: "success",
      });
    } catch (e) {
      toast({
        title: "Erro!",
        description: "Falha ao registrar a ordem de produção!",
        variant: "error",
      });
    }
  });

  const handleAppendProduct = append
  const handleRemoveProduct = remove

  return {
    register,
    handleSubmit,
    errors,
    control,
    setValue,
    reset: hookFormReset,
    productsOnForm: fields,
    handleAppendProduct,
    handleRemoveProduct
  };
}
