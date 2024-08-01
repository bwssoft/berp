import { toast } from '@/app/lib/@frontend/hook/use-toast';
import { createOneInput } from '@/app/lib/@backend/action';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Esse campo não pode ser vazio'),
  measure_unit: z.enum(["cm", "m", "kg", "g", "ml", "l", "un"]),
  category: z.enum(["mdm", "ids", "cis", "com", "pcb", "bat", "cht", "cas", "ant", "dis",]),
  files: z.any(),
  color: z.string(),
  description: z.string().optional(),
  price: z.coerce.number().optional().refine(number => number ? number >= 0 : true),
  manufacturer: z.array(z.object({
    code: z.string(),
    name: z.string(),
  }))
});

export type Schema = z.infer<typeof schema>;

export function useInputCreateForm() {
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

  const { fields: manufacturer, append, remove } = useFieldArray({
    control,
    name: "manufacturer",
  });

  const handleAppedManufacturer = append
  const handleRemoveManufacturer = remove


  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      //fazer a request
      await createOneInput(data);
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

  console.log('errors', errors)

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
