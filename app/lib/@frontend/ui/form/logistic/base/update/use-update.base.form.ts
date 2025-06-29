import { createOneBase, updateOneBaseById } from "@/app/lib/@backend/action";
import { Base, IBase } from "@/app/lib/@backend/domain";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  sku: z
    .string()
    .min(1, "Código é obrigatório")
    .max(100, "Código deve ter no máximo 100 caracteres"),
  type: z.nativeEnum(Base.Type, {
    required_error: "Tipo é obrigatório",
  }),
  enterprise: z.object({
    id: z.string(),
    name: z.object({ short: z.string() }),
  }),
  description: z
    .string()
    .max(1000, "Descrição deve ter no máximo 1000 caracteres")
    .optional(),
  active: z.boolean().default(true),
});

export type Schema = z.infer<typeof schema>;
interface Props {
  defaultValues: IBase;
}
export function useUpdateBaseForm(props: Props) {
  const { defaultValues } = props;
  const router = useRouter();

  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
    setError,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      const { success, error } = await updateOneBaseById(
        { id: defaultValues.id },
        data
      );

      if (success) {
        toast({
          title: "Sucesso!",
          description: "Base atualizada com sucesso!",
          variant: "success",
        });
        router.push("/logistic/base");
        return;
      }

      if (error) {
        Object.entries(error).forEach(([key, message]) => {
          if (key !== "global" && message) {
            setError(key as keyof Schema, {
              type: "manual",
              message: message as string,
            });
          }
        });
        toast({
          title: "Erro!",
          description: error.global ?? "Falha ao atualizar a base!",
          variant: "error",
        });
      }
    } catch {
      toast({
        title: "Erro!",
        description: "Falha ao atualizar a base!",
        variant: "error",
      });
    }
  });

  function handleCancelUpdate() {
    router.push("/logistic/base");
  }

  return {
    register,
    handleSubmit,
    errors,
    control,
    setValue,
    handleCancelUpdate,
  };
}
