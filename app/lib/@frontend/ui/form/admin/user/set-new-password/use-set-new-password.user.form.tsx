import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserPassword } from "@/app/lib/@backend/action";
import { toast } from "@/app/lib/@frontend/hook";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "A senha deve ter no mínimo 8 caracteres")
      .max(32, "A senha deve ter no máximo 32 caracteres")
      .regex(/[A-Z]/, "A senha deve conter ao menos uma letra maiúscula")
      .regex(/[a-z]/, "A senha deve conter ao menos uma letra minúscula")
      .regex(/[0-9]/, "A senha deve conter ao menos um número")
      .regex(/[\!\@\#\$\%\*\(\)_=\+\/\{\}\^\~\?\"`\:\;\.\,\<\>\&]/, "A senha deve conter ao menos um caractere especial"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });


type Schema = z.infer<typeof schema>;

export function useSetNewPasswordUserForm(userId: string) {
  const {
    register,
    handleSubmit: hookFormSubmit,
    setError,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const handleSubmit = hookFormSubmit(async (data) => {
    const { success, error } = await updateUserPassword({ id: userId, password: data.password });
        if(success) {
            toast({
                title: "Sucesso!",
                description: "Sua senha foi alterada com sucesso",
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

            if(error.global) {
                toast({
                    title: "Erro!",
                    description: error.global,
                    variant: "error",
                });
            }
        }
        
    });


  return {
    register,
    handleSubmit,
    errors,
  };
}
