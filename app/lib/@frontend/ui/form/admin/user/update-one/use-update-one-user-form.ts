import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { toast } from "@/app/lib/@frontend/hook";
import { findManyProfile } from "@/app/lib/@backend/action";
import { updateOneUser } from "@/app/lib/@backend/action/admin/user.action";
import { isValidCPF } from "@/app/lib/util/is-valid-cpf";
import { IUser } from "@/app/lib/@backend/domain";
import { UpdateResult } from "mongodb";

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
            .refine((value) => isValidCPF(value), "CPF inválido"),
        email: z.string().email("Email inválido!"),
        name: z.string(),
        active: z.boolean(),
        image: z.string().optional(),
        profile_id: z.array(z.string()),
        username: z.string(),
        lock: z.boolean().optional(),
    })
    .refine(
        (data) => {
            if (!data.active) {
                const emailLower = data.email.toLowerCase();
                return allowedDomains.some((domain) =>
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

export type UpdateUserSchema = z.infer<typeof updateSchema>;

export function useUpdateOneUserForm(user: IUser) {
    const queryClient = useQueryClient();

    const { data: allProfiles } = useQuery({
        queryKey: ["findManyProfiles"],
        queryFn: () => findManyProfile({}),
    });
    const activeProfiles = allProfiles?.filter((p) => p.active) ?? [];

    const {
        register,
        handleSubmit: hookFormSubmit,
        control,
        formState: { errors, isDirty },
        reset,
    } = useForm<UpdateUserSchema>({
        resolver: zodResolver(updateSchema),
        defaultValues: {
            active: true,
            profile_id: [],
        },
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
            });
        }
    }, [user, reset]);

    const { mutateAsync: mutateUpdate } = useMutation<
        UpdateResult<IUser>,
        AxiosError,
        UpdateUserSchema
    >({
        mutationFn: async (formData) => {
            const { id, ...value } = formData;
            if (!id) throw new Error("ID não informado");

            return updateOneUser(id, value);
        },
    });
    const handleSubmit = hookFormSubmit(async (formData) => {
        try {
            await mutateUpdate(formData);
            toast({
                title: "Sucesso!",
                description: "Usuário atualizado com sucesso",
                variant: "success",
            });
            queryClient.invalidateQueries({
                queryKey: ["findOneUser", user.id],
                exact: true,
            });
        } catch (error) {
            console.error(error);
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

    const [showBlockModal, setShowBlockModal] = React.useState(false);

    return {
        isLoadingUser: false,
        profiles: activeProfiles,
        register,
        control,
        errors,
        isDirty,
        showBlockModal,
        userData: user,

        handleSubmit,
        handleCancelEdit,
    };
}
