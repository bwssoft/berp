import { toast } from '@/app/hook/use-toast';
import { updateOneProductById } from '@/app/lib/action';
import { IProduct } from '@/app/lib/definition';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Esse campo não pode ser vazio'),
  description: z.string().min(1, 'Esse campo não pode ser vazio'),
  files: z.any(),
  inputs: z.array(z.object({ input_id: z.string(), quantity: z.coerce.number() })),
});

export type Schema = z.infer<typeof schema>;

interface Props {
  defaultValues: IProduct
}
export function useProductUpdateForm(props: Props) {
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
  const { fields, append, remove } = useFieldArray({
    control,
    name: "inputs",
  });

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      //fazer a request
      await updateOneProductById({ id: defaultValues.id! }, data);
      toast({
        title: "Sucesso!",
        description: "Produto atualizado com sucesso!",
        variant: "success",
      });
    } catch (e) {
      toast({
        title: "Erro!",
        description: "Falha ao atualizar o produto!",
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
