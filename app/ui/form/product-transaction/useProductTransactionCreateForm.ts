import { toast } from '@/app/hook/use-toast';
import { createOneProductTransaction } from '@/app/lib/action';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  type: z.enum(["enter", "exit"]),
  product_id: z.string(),
  quantity: z.coerce.number(),
  files: z.any()
});

export type Schema = z.infer<typeof schema>;

export function useProductTransacionCreateForm() {
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

  const handleSubmit = hookFormSubmit(async (data) => {
    const type = data.type === "enter" ? "Entrada" : "Saída"
    try {
      //fazer a request
      await createOneProductTransaction(data);
      toast({
        title: "Sucesso!",
        description: `${type} registrada com sucesso!`,
        variant: "success",
      });
    } catch (e) {
      toast({
        title: "Erro!",
        description: `Falha ao registrar a ${type}!`,
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
  };
}
