import { toast } from '@/app/hook/use-toast';
import { createOneProduct } from '@/app/lib/action';
import { IInput } from '@/app/lib/definition';
import { handleXlsxFile } from '@/app/lib/util/handle-xlsx-file';
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

interface Props {
  inputs: IInput[]
}

export function useProductCreateForm(props: Props) {
  const { inputs } = props
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


  const handleFile = async (fileList: File[] | null) => {
    const _inputs = await handleXlsxFile<{
      name: string,
      quantity: number,
    }>(fileList, handleFormatInputFromFile)

    _inputs?.forEach(input => handleAppendInput({
      input_id: inputs.find(el => el.name === input.name)?.id ?? "",
      quantity: input.quantity ?? 0,
    }))
  }

  const handleFormatInputFromFile = (obj: {
    Nome?: string,
    Quantidade?: string,
  }) => {
    return {
      name: obj?.Nome ?? "",
      quantity: obj?.Quantidade !== undefined ? Number(obj?.Quantidade) : 0
    }
  }

  return {
    register,
    handleSubmit,
    errors,
    control,
    setValue,
    reset: hookFormReset,
    inputsOnForm: fields,
    handleAppendInput,
    handleRemoveInput,
    handleFile
  };
}
