"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/app/lib/@frontend/hook";
import { findManyProfile, updateOneUser } from "@/app/lib/@backend/action";
import { IUser } from "@/app/lib/@backend/domain";
import { isValidCPF } from "@/app/lib/util/is-valid-cpf";
import { useRouter } from "next/navigation";
import { userConstants } from "@/app/lib/constant";

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
        image: z.object({
            key: z.string()
        }).optional(),
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
    const { data: allProfiles } = useQuery({
        queryKey: ["findManyProfiles"],
        queryFn: () => findManyProfile({}),
    });
    const profiles = allProfiles?.filter((p) => p.active) ?? [];
    const router = useRouter();
    const {
        register,
        handleSubmit: hookSubmit,
        control,
        formState: { errors, isDirty },
        reset,
        setError
    } = useForm<UpdateUserSchema>({
        resolver: zodResolver(updateSchema),
        defaultValues: user,
    });

    const handleSubmit = hookSubmit(async (data) => {

            const {success, error } = await updateOneUser(data.id, data);

            if(success){
                toast({
                    title: "Sucesso!",
                    description: "Usuário atualizado com sucesso",
                    variant: "success",
                });
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

    return {
        profiles,
        register,
        control,
        errors,
        userData: user,
        handleSubmit,
        handleCancelEdit,
        handleBackPage,
    };
}
