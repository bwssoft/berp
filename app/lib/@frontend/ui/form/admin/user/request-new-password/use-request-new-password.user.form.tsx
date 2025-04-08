import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/app/lib/@frontend/hook";
import { requestNewPassword } from "@/app/lib/@backend/action";

const schema = z.object({
  email: z.string(),
});

type Schema = z.infer<typeof schema>;

export function useRequestNewPasswordUserForm() {
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    setError,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const handleSubmit = hookFormSubmit(async (data) => {
    const result = await requestNewPassword(data);
    if (result.success) {
      toast({
        title: "Sucesso!",
        description: "Nova senha requisitada com sucesso.",
        variant: "success",
      });
    } else {
      setError("email", { message: result.error ?? "Algo deu erro" });
      toast({
        title: "Erro!",
        description: result.error ?? "Algo deu errado",
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
