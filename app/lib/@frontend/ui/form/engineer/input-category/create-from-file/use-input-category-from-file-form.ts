import { createManyInputCategories } from "@/app/lib/@backend/action/input/input-category.action";
import { IInputCategory } from "@/app/lib/@backend/domain/engineer/entity/input-category.definition";
import { xlsxToJson } from "@/app/lib/util";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "../../../../../hook";

interface IInputCategorySheet {
  Código: string;
  Nome: string;
}

interface IInputCategoryCreate extends Omit<IInputCategory, 'id' | 'created_at'> { }

const schema = z.object({
  inputs: z.array(z.object({
    name: z.string().min(1, 'Esse campo não pode ser vazio'),
    code: z.string().min(1, 'Esse campo não pode ser vazio'),
  }))
})

export type InputCategoryFromFileSchema = z.infer<typeof schema>;

export function useInputCategoryCreateFromFileForm() {
  const {
    handleSubmit: hookFormSubmit,
    reset: hookFormReset,
    register,
    formState: { errors },
    control,
    setValue,
  } = useForm<InputCategoryFromFileSchema>({
    resolver: zodResolver(schema)
  });

  const { fields: inputs, append, remove } = useFieldArray({
    control,
    name: "inputs"
  });

  const handleAppendInput = append;
  const handleRemoveInput = remove;

  const handleSubmit = hookFormSubmit(async function onSuccess(data) {
    try {
      await createManyInputCategories(data.inputs);
      toast({
        title: "Sucesso!",
        description: "Insumo registrado com sucesso!",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Falha ao registrar o insumo!",
        variant: "error",
      })
    }
  });

  async function handleFile(fileList: File[] | null) {
    const inputs = await xlsxToJson<IInputCategoryCreate>(fileList, handleFormatInputFromFile);
    inputs?.forEach((input) =>
      handleAppendInput({
        code: input.code,
        name: input.name
      })
    )
  }

  function handleFormatInputFromFile(obj: IInputCategorySheet): IInputCategoryCreate {
    return {
      code: obj.Código,
      name: obj.Nome
    }
  }

  return {
    register,
    errors,
    setValue,
    inputs,
    handleSubmit,
    handleFile,
    handleAppendInput,
    handleRemoveInput,
    hookFormReset,
  }
}