import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {IFirmware} from "@/backend/domain/engineer/entity/firmware.definition";
import { updateOneFirmwareById } from "@/backend/action/engineer/firmware/firmware.action";

const schema = z.object({
  name: z.string().min(1, "Campo obrigatório"),
  name_in_device: z.string().min(1, "Campo obrigatório"),
  version: z.string().min(1, "Campo obrigatório"),
  description: z.string(),
  file: z
    .any()
    .refine((file) => (file ? file instanceof File : true), "Arquivo inválido"),
});

export type Schema = z.infer<typeof schema>;

interface Props {
  defaultValues: IFirmware;
}
export function useFirmwareUpdateForm(props: Props) {
  const {
    defaultValues: { file: oldFile, ...defaultValue },
  } = props;

  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,
    setValue,
    reset: hookFormReset,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: defaultValue,
  });

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      //fazer a request
      const { file: newFile, ...valuetoUpdate } = data;
      const formData = new FormData();

      if (newFile) {
        formData.append("file", newFile);
      }

      const firmware = Object.assign(valuetoUpdate, { file: oldFile });

      await updateOneFirmwareById({ id: defaultValue.id! }, firmware, formData);
      toast({
        title: "Sucesso!",
        description: "Firmware atualizado com sucesso!",
        variant: "success",
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Erro!",
        description: "Falha ao atualizar o firmware!",
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
    reset: hookFormReset,
  };
}

