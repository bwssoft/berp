import { toast } from '@/app/hook/use-toast';
import { createOneInputTransaction } from '@/app/lib/action/input/input-transaction.action';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  type: z.enum(["enter", "exit"]),
  input_id: z.string(),
  quantity: z.coerce.number(),
  files: z.any()
});

export type Schema = z.infer<typeof schema>;

export function useInputTransacionCreateForm() {
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
    try {
      //fazer a request
      await createOneInputTransaction(data);
      toast({
        title: "Sucesso!",
        description: "Entrada registrada com sucesso!",
        variant: "success",
      });
    } catch (e) {
      toast({
        title: "Erro!",
        description: "Falha ao registrar a entrada!",
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
