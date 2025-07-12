"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { IUser } from "@/app/lib/@backend/domain";
import { isValidCPF } from "@/app/lib/util/is-valid-cpf";
import { useRouter } from "next/navigation";
import { userConstants } from "@/app/lib/constant";
import { useEffect, useState } from "react";
import { findManyProfile } from "@/app/lib/@backend/action/admin/profile.action";
import { updateOneUser } from "@/app/lib/@backend/action/admin/user.action";

const updateSchema = z
    .object({
        id: z.string(),
        cpf: z
            .string()
            .min(11, "CPF obrigatório")
            .refine(isValidCPF, "CPF inválido"),
        email: z.string().email("Email inválido!"),
        name: z.string(),
        active: z.boolean(),
        image: z.any().optional(),
        profile: z
            .array(z.object({ id: z.string(), name: z.string() }))
            .min(1, "Selecione pelo menos um perfil"),
        username: z.string(),
        lock: z.boolean().optional(),
        external: z.boolean().optional(),
    })
    .refine(
        (data) => {
            if (!data.external) {
                const emailLower = data.email.toLowerCase();
                return userConstants.allowedDomains.some((domain) => emailLower.endsWith(domain));
                
            }
            return true;
        },
        {
            path: ["email"],
            message: "Obrigatório informar um email com domínio interno!",
        }
    );

export type UpdateUserSchema = z.infer<typeof updateSchema>;

export function useUpdateOneUserForm(user: IUser) {
    const [searchTerm, setSearchTerm] = useState("");

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

    const router = useRouter();

    const {
        register,
        handleSubmit: hookSubmit,
        control,
        formState: { errors, isDirty },
        reset,
        setError,
    } = useForm<UpdateUserSchema>({
        resolver: zodResolver(updateSchema),
        defaultValues: user,
    });

    const handleSubmit = hookSubmit(async (data) => {
        const formData = new FormData();
        // envia as imagens por formData
        if (Array.isArray(data.image)) {
          data.image.forEach((file) => {
            formData.append("file", file);
          });
        }
        const {success, error } = await updateOneUser(data.id, {
            ...data,
            image: undefined,
        }, formData);

        if(success){
            toast({
                title: "Sucesso!",
                description: "Usuário atualizado com sucesso",
                variant: "success",
            });
            router.push("/admin/user");
        }else if(error){
            Object.entries(error).forEach(([key, message]) => {
                if (key !== "global" && message) {
                    setError(key as keyof UpdateUserSchema, {
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
        if (isDirty && user) {
            reset(user);
        }
    }

    function handleBackPage() {
        router.back();
    }

    useEffect(() => {
        reset(user)
    }, [reset, user])

    return {
        profiles,
        register,
        control,
        errors,
        userData: user,
        handleSubmit,
        handleCancelEdit,
        handleBackPage,
        setSearchTerm
    };
}
