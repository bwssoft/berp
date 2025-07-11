"use client";
import { findManyProfile } from "@/app/lib/@backend/action/admin/profile.action";
import { createOneUser } from "@/app/lib/@backend/action/admin/user.action";
import { toast } from "@/app/lib/@frontend/hook";
import { userConstants } from "@/app/lib/constant";
import { isValidCPF } from "@/app/lib/util/is-valid-cpf";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
    image: z.any().optional(),
    profile: z
      .array(z.object({ id: z.string(), name: z.string() }))
      .min(1, "Selecione pelo menos um perfil"),
    username: z.string().min(3, "Obrigatório informar um nome de usuário"),
  })
  .refine(
    (data) => {
      if (!data.external) {
        const emailLower = data.email.toLowerCase();
        return userConstants.allowedDomains.some((domain) =>
          emailLower.endsWith(domain)
        );
      }
      return true;
    },
    {
      path: ["email"],
      message: "Obrigatório informar um email com domínio interno!",
    }
  );

export type Schema = z.infer<typeof schema>;

export function useCreateOneUserForm() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit: hookFormSubmit,
    control,
    formState: { errors },
    setError,
    reset,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      external: false,
      profile: [],
    },
  });

  const initialProfiles = useQuery({
    queryKey: ["findManyProfiles", "initial"],
    queryFn: async () => {
      const { docs } = await findManyProfile({});
      return docs;
    }
  });

    const searchedProfiles = useQuery({
    queryKey: ["findManyProfiles", searchTerm],
    queryFn: async () => {
      const filter: Record<string, any> = {};

      if (searchTerm.trim() !== "") {
        filter["name"] = { $regex: searchTerm, $options: "i" };
      }
      const { docs } = await findManyProfile(filter);
        return docs;
    },
    enabled: searchTerm.length > 0
    });

    const profiles = searchTerm.length > 0 
        ? searchedProfiles.data ?? [] 
        : initialProfiles.data?.filter(p => p.active) ?? [];


  const handleSubmit = hookFormSubmit(async (data) => {
    const formData = new FormData();
    if (Array.isArray(data.image)) {
      data.image.forEach((file) => {
        formData.append("file", file);
      });
    }

    const { success, error } = await createOneUser(
      {
        ...data,
        active: true,
        lock: false,
        image: undefined,
      },
      formData
    );
    if (success) {
      toast({
        title: "Sucesso!",
        description: "Usuário registrado com sucesso!",
        variant: "success",
      });
      router.push("/admin/user");
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
    profiles,
    errors,
    handleCancelEdit,
    setSearchTerm
  };
}
