import { toast } from '@/app/hook/use-toast';
import { createOneProduct } from '@/app/lib/action';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Esse campo não pode ser vazio'),
  description: z.string().min(1, 'Esse campo não pode ser vazio'),
  color: z.string(),
  files: z.any(),
  inputs: z.array(z.object({ input_id: z.string(), quantity: z.coerce.number() })),
});

export type Schema = z.infer<typeof schema>;

export function useProductCreateForm() {
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
    name: "inputs",
  });

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      //fazer a request
      await createOneProduct(data);
      toast({
        title: "Sucesso!",
        description: "Produto registrado com sucesso!",
        variant: "success",
      });
    } catch (e) {
      toast({
        title: "Erro!",
        description: "Falha ao registrar o produto!",
        variant: "error",
      });
    }
  });

  const handleAppendInput = append
  const handleRemoveInput = remove

  return {
    register,
    handleSubmit,
    errors,
    control,
    setValue,
    reset: hookFormReset,
    inputsOnForm: fields,
    handleAppendInput,
    handleRemoveInput
  };
}
