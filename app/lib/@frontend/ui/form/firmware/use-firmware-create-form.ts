import { toast } from '@/app/lib/@frontend/hook/use-toast';
import { createOneFirmware } from '@/app/lib/@backend/action';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect } from 'react';

const schema = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string().min(1, 'Esse campo não pode ser vazio'),
  file: z
    .any()
    .refine((file) => file instanceof FileList, "Arquivo inválido")
});

export type Schema = z.infer<typeof schema>;

export function useFirmwareCreateForm() {
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

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      //fazer a request
      const { file, ...firmware } = data
      const formData = new FormData()
      formData.append("file", file[0])
      await createOneFirmware(firmware, formData);
      toast({
        title: "Sucesso!",
        description: "Firmware registrado com sucesso!",
        variant: "success",
      });
    } catch (e) {
      console.log(e)
      toast({
        title: "Erro!",
        description: "Falha ao registrar o firmware!",
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
