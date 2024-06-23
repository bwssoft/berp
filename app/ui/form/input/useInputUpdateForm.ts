import { toast } from '@/app/hook/use-toast';
import { createOneInput, updateOneInputById } from '@/app/lib/action';
import { IInput } from '@/app/lib/definition';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Esse campo não pode ser vazio'),
  description: z.string().min(1, 'Esse campo não pode ser vazio'),
  measure_unit: z.enum(["cm", "m", "kg", "g", "ml", "l", "un"]),
  files: z.any(),
  color: z.string(),
  price: z.coerce.number()
});

export type Schema = z.infer<typeof schema>;

interface Props {
  defaultValues: IInput
}
export function useInputUpdateForm(props: Props) {
  const { defaultValues } = props
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,
    setValue,
    reset: hookFormReset,

  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues
  });

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      //fazer a request
      await updateOneInputById({ id: defaultValues.id! }, data);
      toast({
        title: "Sucesso!",
        description: "Insumo atualizado com sucesso!",
        variant: "success",
      });
    } catch (e) {
      toast({
        title: "Erro!",
        description: "Falha ao atualizar o insumo!",
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
