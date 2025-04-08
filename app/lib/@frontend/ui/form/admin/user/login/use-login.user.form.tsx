import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/app/lib/@frontend/hook";
import { AuthError } from "next-auth";
import { authenticate } from "@/app/lib/@backend/action";

const schema = z.object({
  username: z.string(),
  password: z
    .string()
    .min(6, "A senha deve ter no mínimo 8 caracteres")
    .max(32, "A senha deve ter no máximo 32 caracteres")
    .regex(/[A-Z]/, "A senha deve conter ao menos uma letra maiúscula")
    .regex(/[a-z]/, "A senha deve conter ao menos uma letra minúscula")
    .regex(/[0-9]/, "A senha deve conter ao menos um número")
    .regex(
      /[\!\@\#\$\%\*\(\)_=\+\/\{\}\^\~\?\"`\:\;\.\,\<\>\&]/,
      "A senha deve conter ao menos um caractere especial"
    ),
});

type Schema = z.infer<typeof schema>;

export function useLoginUserForm() {
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const handleSubmit = hookFormSubmit(async (data) => {
    const formData = new FormData();
    formData.set("username", data.username);
    formData.set("password", data.password);

    const login = await authenticate(undefined, formData);

    if (login.success) {
      toast({
        title: "Sucesso!",
        description: "Login realizado com sucesso.",
        variant: "success",
      });
    } else {
      toast({
        title: "Erro!",
        description: login.error ?? "Algo deu errado",
        variant: "error",
      });
    }
  });

  return {
    register,
    handleSubmit,
    errors,
  };
}
