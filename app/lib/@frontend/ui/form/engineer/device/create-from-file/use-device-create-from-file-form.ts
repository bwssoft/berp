import { toast } from '@/app/lib/@frontend/hook/use-toast';
import { createManyDevice } from '@/app/lib/@backend/action';
import { xlsxToJson } from '@/app/lib/util';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { IProduct } from '@/app/lib/@backend/domain';

const schema = z.object({
  devices: z.array(z.object({
    serial: z.string().min(1, 'Esse campo não pode ser vazio'),
    product_id: z.string().min(1, 'Esse campo não pode ser vazio'),
  }))
});

export type Schema = z.infer<typeof schema>;

interface Props {
  products: IProduct[];
}

export function useDeviceCreateFromFileForm(props: Props) {
  const { products } = props
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
    const devices = await xlsxToJson<{
      serial?: string,
      model?: string,
    }>(fileList, handleFormatDeviceFromFile)

    devices?.forEach(device => handleAppedDevice({
      serial: device.serial ?? "",
      product_id: products.find(el => el.name === device.model)?.id ?? "",
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
