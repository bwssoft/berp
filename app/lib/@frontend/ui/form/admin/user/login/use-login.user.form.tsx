import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/app/lib/@frontend/hook";
import { authenticate } from "@/app/lib/@backend/action";
import { auth } from "@/auth";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const schema = z.object({
  username: z.string(),
  password: z
    .string()
    .nonempty("É necessário informar a senha")
    .min(6, "A senha deve ter no mínimo 8 caracteres")
    .max(32, "A senha deve ter no máximo 32 caracteres")
    .regex(/[A-Z]/, "A senha deve conter ao menos uma letra maiúscula")
    .regex(/[a-z]/, "A senha deve conter ao menos uma letra minúscula")
    .regex(/[0-9]/, "A senha deve conter ao menos um número")
    .regex(
      /[!@#$%^&*()_\-+=\[\]{};:'"\\|,.<>\/?`~]/,
      "A senha deve conter ao menos um caractere especial"
    ),
});

type Schema = z.infer<typeof schema>;

export function useLoginUserForm() {
  const router = useRouter();
  const { update } = useSession();
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const handleSubmit = hookFormSubmit(async (data) => {
    const login = await authenticate(data);
    await update();
    if (login.success) {
      const session = await auth();
      if (session?.user.temporary_password) {
        router.push(`/set-password?id=${session.user.id}`);
      } else {
        router.push("/home");
        toast({
          title: "Sucesso!",
          description: "Login realizado com sucesso.",
          variant: "success",
        });
      }
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
