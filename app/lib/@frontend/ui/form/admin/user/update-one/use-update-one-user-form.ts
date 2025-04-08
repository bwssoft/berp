"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/app/lib/@frontend/hook";
import { findManyProfile, updateOneUser } from "@/app/lib/@backend/action";
import { IUser } from "@/app/lib/@backend/domain";
import { isValidCPF } from "@/app/lib/util/is-valid-cpf";

const allowedDomains = [
    "@bwsiot.com",
    "@bwstechnology.com",
    "@mgctechnology.com",
    "@icb.com",
];

const updateSchema = z
    .object({
        id: z.string().optional(),
        cpf: z
            .string()
            .min(11, "CPF obrigatório")
            .refine(isValidCPF, "CPF inválido"),
        email: z.string().email("Email inválido!"),
        name: z.string(),
        active: z.boolean(),
        image: z.string().optional(),
        profile_id: z.array(z.string()),
        username: z.string(),
        lock: z.boolean().optional(),
        external: z.boolean().optional(),
    })
    .refine(
        (data) =>
            data.external ||
            allowedDomains.some((d) => data.email.toLowerCase().endsWith(d)),
        {
            path: ["email"],
            message: "Obrigatório informar um email com domínio interno!",
        }
    );

export type UpdateUserSchema = z.infer<typeof updateSchema>;

export function useUpdateOneUserForm(user: IUser) {
    const queryClient = useQueryClient();

    const { data: allProfiles } = useQuery({
        queryKey: ["findManyProfiles"],
        queryFn: () => findManyProfile({}),
    });
    const profiles = allProfiles?.filter((p) => p.active) ?? [];

    const {
        register,
        handleSubmit: hookSubmit,
        control,
        formState: { errors, isDirty },
        reset,
    } = useForm<UpdateUserSchema>({
        resolver: zodResolver(updateSchema),
        defaultValues: { active: true, profile_id: [] },
    });

    React.useEffect(() => {
        if (user) {
            reset({
                id: user.id,
                cpf: user.cpf,
                email: user.email,
                name: user.name,
                active: user.active,
                image: user.image,
                profile_id: Array.isArray(user.profile_id)
                    ? user.profile_id
                    : [user.profile_id],
                username: user.username,
                lock: user.lock,
                external: user.external,
            });
        }
    }, [user, reset]);

    const handleSubmit = hookSubmit(async (data) => {
        try {
            if (!data.id) throw new Error("ID não informado");

            await updateOneUser(data.id, data);

            toast({
                title: "Sucesso!",
                description: "Usuário atualizado com sucesso",
                variant: "success",
            });
            queryClient.invalidateQueries({
                queryKey: ["findOneUser", user.id],
            });
        } catch (err) {
            console.error(err);
            toast({
                title: "Erro",
                description: "Não foi possível atualizar o usuário",
                variant: "error",
            });
        }
    });

    function handleCancelEdit() {
        if (isDirty && user) {
            reset({
                ...user,
                profile_id: Array.isArray(user.profile_id)
                    ? user.profile_id
                    : [user.profile_id],
            });
        }
    }

    return {
        profiles,
        register,
        control,
        errors,
        userData: user,
        handleSubmit,
        handleCancelEdit,
    };
}
