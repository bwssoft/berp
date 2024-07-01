import { toast } from '@/app/hook/use-toast';
import { createManyInput } from '@/app/lib/action';
import { IInput } from '@/app/lib/definition';
import { getRandomHexColor } from '@/app/lib/util/get-hex-color';
import { handleXlsxFile } from '@/app/lib/util/handle-xlsx-file';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  inputs: z.array(z.object({
    name: z.string().min(1, 'Esse campo não pode ser vazio'),
    measure_unit: z.enum(["cm", "m", "kg", "g", "ml", "l", 'un']),
    price: z.coerce.number(),
    color: z.string()
  }))
});

export type Schema = z.infer<typeof schema>;

export function useInputCreateFromFileForm() {
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

  const { fields: inputs, append, remove } = useFieldArray({
    control,
    name: "inputs",
  });

  const handleAppedInput = append
  const handleRemoveInput = remove

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      //fazer a request
      await createManyInput(data.inputs);
      toast({
        title: "Sucesso!",
        description: "Insumo registrado com sucesso!",
        variant: "success",
      });
    } catch (e) {
      toast({
        title: "Erro!",
        description: "Falha ao registrar o insumo!",
        variant: "error",
      });
    }
  });

  const handleFile = async (fileList: File[] | null) => {
    const inputs = await handleXlsxFile<{
      name: string,
      price: number,
      measure_unit: IInput["measure_unit"]
    }>(fileList, handleFormatInputFromFile)

    inputs?.forEach(input => handleAppedInput({
      price: input.price,
      measure_unit: input.measure_unit,
      name: input.name,
      color: getRandomHexColor(),
    }))
  }

  const handleFormatInputFromFile = (obj: { Nome: string, Preço: string, "Unidade de Medida": string }) => {
    return {
      name: obj.Nome,
      measure_unit: obj["Unidade de Medida"] as IInput["measure_unit"],
      price: Number(obj.Preço)
    }
  }

  return {
    register,
    handleSubmit,
    errors,
    control,
    setValue,
    reset: hookFormReset,
    handleAppedInput,
    inputs,
    handleRemoveInput,
    handleFile
  };
}
