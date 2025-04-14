"use client";
import { findManyProfile } from "@/app/lib/@backend/action";
import { createOneUser } from "@/app/lib/@backend/action/admin/user.action";
import { toast } from "@/app/lib/@frontend/hook";
import { userConstants } from "@/app/lib/constant";
import { isValidCPF } from "@/app/lib/util/is-valid-cpf";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const schema = z
  .object({
    cpf: z
      .string()
      .min(11, "CPF obrigatório")
      .refine((value) => isValidCPF(value), "CPF inválido"),
    email: z.string().email("Email inválido!"),
    name: z.string().min(2, "Obrigatório informar um nome"),
    external: z.boolean(),
    image: z.any(),
    profile: z
      .array(z.object({ id: z.string(), name: z.string() }))
      .min(1, "Selecione pelo menos um perfil"),
    username: z.string().min(3, "Obrigatório informar um nome de usuário"),
  })
  .refine(
    (data) => {
      // se externo igual a true é usuario externo, se for false é usuário interno
      if (!data.external) {
        // se for usuário interno
        const emailLower = data.email.toLowerCase();
        return userConstants.allowedDomains.some((domain) =>
          emailLower.endsWith(domain)
        );
      }
      return true; // se for externo, qualquer e-mail é aceito
    },
    {
      path: ["email"],
      message: "Obrigatório informar um email com domínio interno!",
    }
  );

export type Schema = z.infer<typeof schema>;

export function useCreateOneUserForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit: hookFormSubmit,
    control,
    formState: { errors },
    setError,
    reset,
    watch,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      external: false, // Por default o checkbox deve estar desmarcado para usuário interno e marcado para usuário externo.
      profile: [],
    },
  });

  const profiles = useQuery({
    queryKey: ["findManyProfiles"],
    queryFn: () => findManyProfile({}),
  });

  const activeProfiles = profiles.data?.filter((p) => p.active) ?? [];

  const handleSubmit = hookFormSubmit(async (data) => {
    const formData = new FormData();
    // envia as imagens por formData
    if (Array.isArray(data.image)) {
      data.image.forEach((file) => {
        formData.append("file", file);
      });
    }

    const { success, error } = await createOneUser({
      ...data,
      active: true,
      lock: false,
      image: undefined,
    }, formData);
    if (success) {
      router.back();
      toast({
        title: "Sucesso!",
        description: "Usuário registrado com sucesso!",
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
  });

  function handleCancelEdit() {
    reset({
      cpf: "",
      external: false,
      email: "",
      name: "",
      username: "",
      image: "",
      profile: [],
    });
    router.back();
  }

  return {
    handleSubmit,
    register,
    control,
    profiles: activeProfiles,
    errors,
    handleCancelEdit,
  };
}
