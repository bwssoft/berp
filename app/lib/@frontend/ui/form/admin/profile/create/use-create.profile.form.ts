import { createOneProfile } from "@/app/lib/@backend/action";
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
    reset,
    setError,
    reset: hookFormReset,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      //fazer a request
      const { success, error } = await createOneProfile(data);
      if (success) {
        router.push("/admin/profile");
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
    router.push("/admin/profile");
  });

  function handleCancelCreate() {
    reset({
      active: undefined,
      name: "",
      locked_control_code: [],
    });
    router.back();
  }

  return {
    register,
    handleSubmit,
    errors,
    control,
    setValue,
    handleCancelCreate,
  };
}
