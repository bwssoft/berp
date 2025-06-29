import { updateOneInputById } from "@/app/lib/@backend/action/engineer/input/input.action";
import { IInput } from "@/app/lib/@backend/domain";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Esse campo não pode ser vazio"),
  measure_unit: z.enum(["cm", "m", "kg", "g", "ml", "l", "un"]),
  category: z.enum([
    "cap",
    "dio",
    "fet",
    "swa",
    "dcd",
    "res",
    "con",
    "mod",
    "ldo",
    "led",
    "sen",
    "ind",
    "mem",
    "ic",
    "ant",
    "fus",
    "swi",
    "trn",
  ]),
  files: z.any(),
  color: z.string(),
  description: z.string().optional(),
  price: z.coerce
    .number()
    .optional()
    .refine((number) => (number ? number >= 0 : true)),
  manufacturer: z.array(
    z.object({
      code: z.string(),
      name: z.string(),
    })
  ),
});

export type Schema = z.infer<typeof schema>;

interface Props {
  defaultValues: IInput;
}
export function useInputUpdateForm(props: Props) {
  const { defaultValues } = props;
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,
    setValue,
    reset: hookFormReset,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const {
    fields: manufacturer,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "manufacturer",
  });

  const handleAppedManufacturer = append;
  const handleRemoveManufacturer = remove;

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
    manufacturer,
    handleAppedManufacturer,
    handleRemoveManufacturer,
    reset: hookFormReset,
  };
}
