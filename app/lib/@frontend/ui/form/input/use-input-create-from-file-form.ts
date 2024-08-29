import { toast } from '@/app/lib/@frontend/hook/use-toast';
import { createManyInput } from '@/app/lib/@backend/action';
import { IInput } from '@/app/lib/@backend/domain';
import { getRandomHexColor } from '@/app/lib/util/get-hex-color';
import { xlsxToJson } from '@/app/lib/util';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  inputs: z.array(z.object({
    name: z.string().min(1, 'Esse campo não pode ser vazio'),
    measure_unit: z.enum(["cm", "m", "kg", "g", "ml", "l", "un"]),
    category: z.enum(["cap", "dio", "fet", "swa", "dcd", "res", "con", "mod", "ldo", "led", "sen", "ind", "mem", "ic"]),
    color: z.string(),
    price: z.coerce.number().optional().refine(number => number ? number >= 0 : true),
    manufacturer: z.array(z.object({
      code: z.string(),
      name: z.string(),
    }))
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
    const inputs = await xlsxToJson<{
      name?: string,
      price?: number,
      measure_unit?: IInput["measure_unit"]
      category?: IInput["category"],
      part_number_1?: string,
      part_number_2?: string,
      part_number_3?: string,
      manufacturer_name_1?: string,
      manufacturer_name_2?: string,
      manufacturer_name_3?: string,
    }>(fileList, handleFormatInputFromFile)

    inputs?.forEach(input => handleAppedInput({
      price: input.price ?? 0,
      measure_unit: input.measure_unit ?? "" as IInput["measure_unit"],
      category: input.category ?? "" as IInput["category"],
      name: input.name ?? "",
      color: getRandomHexColor(),
      manufacturer: [
        {
          code: input.part_number_1 ?? "",
          name: input.manufacturer_name_1 ?? ""
        },
        {
          code: input.part_number_2 ?? "",
          name: input.manufacturer_name_2 ?? ""
        },
        {
          code: input.part_number_3 ?? "",
          name: input.manufacturer_name_3 ?? ""
        }
      ]
    }))
  }

  const handleFormatInputFromFile = (obj: {
    Nome: string,
    Preço: number,
    "Unidade de Medida": string,
    Categoria: string
    "Part Number 1": string
    "Part Number 2": string
    "Part Number 3": string
    "Nome Fornecedor 1": string
    "Nome Fornecedor 2": string
    "Nome Fornecedor 3": string
  }) => {
    return {
      name: obj.Nome,
      measure_unit: obj["Unidade de Medida"] as IInput["measure_unit"],
      price: obj["Preço"] ?? undefined,
      category: obj["Categoria"] as IInput["category"],
      part_number_1: obj["Part Number 1"] ?? undefined,
      part_number_2: obj["Part Number 2"] ?? undefined,
      part_number_3: obj["Part Number 3"] ?? undefined,
      manufacturer_name_1: obj["Nome Fornecedor 1"] ?? undefined,
      manufacturer_name_2: obj["Nome Fornecedor 2"] ?? undefined,
      manufacturer_name_3: obj["Nome Fornecedor 3"] ?? undefined,
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
