import { createOneProfile, findManyControl } from "@/app/lib/@backend/action";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Esse campo não pode ser vazio"),
  active: z.boolean().default(true),
  locked_control_code: z.array(z.string()).default([]),
});

export type Schema = z.infer<typeof schema>;

export function useCreateProfileForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,
    setValue,
    setError,
    reset: hookFormReset,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      //fazer a request
      const controls = await findManyControl({}, 200);
      data.locked_control_code = controls.map(({ code }) => code);
      const { success, error } = await createOneProfile(data);
      if (success) {
        toast({
          title: "Sucesso!",
          description: "Perfil registrado com sucesso!",
          variant: "success",
        });
      } else if (error) {
        Object.entries(error).forEach(([key, message]) => {
          if (key !== "global" && message) {
            setError(key as keyof Schema, {
              type: "manual",
              message: message as string,
            });
          }
        });
        if (error.global) {
          toast({
            title: "Erro!",
            description: error.global,
            variant: "error",
          });
        }
      }
    } catch (e) {
      toast({
        title: "Erro!",
        description: "Falha ao registrar o perfil!",
        variant: "error",
      });
    }
  });

  function handleBackPage() {
    router.back();
  }

  return {
    register,
    handleBackPage,
    handleSubmit,
    errors,
    control,
    setValue,
    reset: hookFormReset,
  };
}
