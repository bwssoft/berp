import { toast } from '@/app/lib/@frontend/hook/use-toast';
import { createOneDevice } from '@/app/lib/@backend/action';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  serial: z.string().min(1, 'Esse campo não pode ser vazio'),
  product_id: z.string().min(1, 'Esse campo não pode ser vazio'),
});

export type Schema = z.infer<typeof schema>;

export function useDeviceCreateForm() {
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
      await createOneDevice(data);
      toast({
        title: "Sucesso!",
        description: "Equipamento registrado com sucesso!",
        variant: "success",
      });
    } catch (e) {
      toast({
        title: "Erro!",
        description: "Falha ao registrar o equipamento!",
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
