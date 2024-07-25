import { toast } from '@/app/lib/@frontend/hook/use-toast';
import { createManyDevice } from '@/app/lib/@backend/action';
import { handleXlsxFile } from '@/app/lib/util/handle-xlsx-file';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  devices: z.array(z.object({
    serial: z.string().min(1, 'Esse campo não pode ser vazio'),
    model: z.string().min(1, 'Esse campo não pode ser vazio'),
  }))
});

export type Schema = z.infer<typeof schema>;

export function useDeviceCreateFromFileForm() {
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

  const { fields: devices, append, remove } = useFieldArray({
    control,
    name: "devices",
  });

  const handleAppedDevice = append
  const handleRemoveDevice = remove

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      //fazer a request
      await createManyDevice(data.devices);
      toast({
        title: "Sucesso!",
        description: "Equipamentos registrados com sucesso!",
        variant: "success",
      });
    } catch (e) {
      toast({
        title: "Erro!",
        description: "Falha ao registrar os equipamentos!",
        variant: "error",
      });
    }
  });

  const handleFile = async (fileList: File[] | null) => {
    const devices = await handleXlsxFile<{
      serial?: string,
      model?: string,
    }>(fileList, handleFormatDeviceFromFile)
    devices?.forEach(input => handleAppedDevice({
      serial: input.serial ?? "",
      model: input.model ?? "",
    }))
  }

  const handleFormatDeviceFromFile = (obj: {
    Serial: string,
    Modelo: string,
  }) => {
    return {
      serial: obj.Serial ?? undefined,
      model: obj.Modelo ?? undefined,
    }
  }

  return {
    register,
    handleSubmit,
    errors,
    control,
    setValue,
    reset: hookFormReset,
    handleAppedDevice,
    devices,
    handleRemoveDevice,
    handleFile
  };
}
