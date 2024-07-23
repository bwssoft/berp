import { toast } from '@/app/lib/@frontend/hook/use-toast';
import { updateOneFirmwareById } from '@/app/lib/@backend/action';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect } from 'react';
import { IFirmware } from '@/app/lib/@backend/domain';

const schema = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string().min(1, 'Esse campo não pode ser vazio'),
  file: z
    .any()
    .refine((file) => file instanceof File, "Arquivo inválido")
});

export type Schema = z.infer<typeof schema>;

interface Props {
  defaultValues: IFirmware
}
export function useFirmwareUpdateForm(props: Props) {
  const { defaultValues: { file: oldFile, ...defaultValue } } = props

  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,
    setValue,
    reset: hookFormReset,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: defaultValue
  });

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      //fazer a request
      const { file: newFile, ...valuetoUpdate } = data
      const formData = new FormData()
      formData.append("file", newFile)

      const firmware = Object.assign(valuetoUpdate, { file: oldFile })

      await updateOneFirmwareById({ id: defaultValue.id! }, firmware, formData);
      toast({
        title: "Sucesso!",
        description: "Firmware atualizado com sucesso!",
        variant: "success",
      });
    } catch (e) {
      console.log(e)
      toast({
        title: "Erro!",
        description: "Falha ao atualizar o firmware!",
        variant: "error",
      });
    }
  });

  useEffect(() => {
    console.log('errors', errors)
  }, [errors])


  return {
    register,
    handleSubmit,
    errors,
    control,
    setValue,
    reset: hookFormReset,
  };
}
