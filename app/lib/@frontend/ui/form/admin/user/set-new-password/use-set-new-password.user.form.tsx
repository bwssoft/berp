import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { logout, updateUserPassword } from "@/app/lib/@backend/action";
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
      .regex(
        /[\!\@\#\$\%\*\(\)_=\+\/\{\}\^\~\?\"`\:\;\.\,\<\>\&]/,
        "A senha deve conter ao menos um caractere especial"
      ),
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
    watch,
    formState: { errors },
  } = useForm<Schema>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: {
      confirmPassword: "",
      password: ""
    }
  });

  const handleSubmit = hookFormSubmit(async (data) => {
    const { success, error } = await updateUserPassword({
      id: userId,
      password: data.password,
    });
    if (success) {
      toast({
        title: "Sucesso!",
        description: "Sua senha foi alterada com sucesso",
        variant: "success",
      });
      await logout();
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
  });

  const password = watch("password") || "";

  const rules = [
    {
      label: "A senha deve ter no mínimo 8 caracteres.",
      isValid: password.length >= 8,
    },
    {
      label: "A senha deve ter no máximo 32 caracteres.",
      isValid: password.length >= 8 && password.length <= 32,
    },
    {
      label: "A senha deve conter uma letra minúscula.",
      isValid: /[a-z]/.test(password),
    },
    {
      label: "A senha deve conter uma letra maiúscula.",
      isValid: /[A-Z]/.test(password),
    },
    {
      label: "A senha deve conter ao menos um número.",
      isValid: /[0-9]/.test(password),
    },
    {
      label: "A senha deve ter ao menos um caractere especial.",
      isValid: /[!@#$%*()_+=\[\]{}^~?:;"`<>,.&\\/]/.test(password),
    },
  ];

  return {
    register,
    handleSubmit,
    errors,
    watch,
    rules
  };
}
