import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { IDevice } from "@/app/lib/@backend/domain/engineer/entity/device.definition";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  serial: z.string().min(1, "Esse campo não pode ser vazio"),
  product_id: z.string().min(1, "Esse campo não pode ser vazio"),
});

export type Schema = z.infer<typeof schema>;

interface Props {
  defaultValues: IDevice;
}
export function useDeviceUpdateForm(props: Props) {
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
    // defaultValues,
  });

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      //fazer a request
      // await updateOneDeviceById({ id: defaultValues.id! }, data);
      toast({
        title: "Sucesso!",
        description: "Equipamento atualizado com sucesso!",
        variant: "success",
      });
    } catch (e) {
      toast({
        title: "Erro!",
        description: "Falha ao atualizar o equipamento!",
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
