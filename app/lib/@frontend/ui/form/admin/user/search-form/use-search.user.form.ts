"use client";

import { useState, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/app/lib/@frontend/hook/use-debounce";
import { removeSpecialCharacters } from "@/app/lib/util/removeSpecialCharacters";
import { findManyProfile } from "@/app/lib/@backend/action/admin/profile.action";
import { findManyUser } from "@/app/lib/@backend/action/admin/user.action";
import { useHandleParamsChange } from "@/app/lib/@frontend/hook/use-handle-params-change";

const schema = z.object({
    quick: z.string().optional(),

    name: z.string().optional(),
    cpf: z.string().optional(),
    profile: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
        })
    ),
    username: z.string().optional(),
    email: z.string().optional(),

    active: z
        .array(
            z.object({
                id: z.string(),
                name: z.string(),
                value: z.boolean(),
            })
        )
        .optional(),
    external: z
        .array(
            z.object({
                id: z.string(),
                name: z.string(),
                value: z.boolean(),
            })
        )
        .optional(),
});

export type SearchProfileFormValues = z.infer<typeof schema>;

export const useSearchUserForm = () => {
    const [profileSearchTerm, setProfileSearchTerm] = useState("");
    const [userSearchTerm, setUserSearchTerm] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        control,
        watch,
        formState: { errors },
    } = useForm<SearchProfileFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            cpf: "",
            profile: [],
            username: "",
            email: "",
            active: undefined,
            external: undefined,
        },
    });
    const { handleParamsChange } = useHandleParamsChange();

    const { data: profiles = [] } = useQuery({
        queryKey: ["findManyProfiles", profileSearchTerm],
        queryFn: async () => {
            const filter: Record<string, any> = {};

            if (profileSearchTerm.trim() !== "") {
                filter["name"] = { $regex: profileSearchTerm, $options: "i" };
            }
            const { docs } = await findManyProfile(filter);
            return docs;
        },
    });

    const { data: users = [] } = useQuery({
        queryKey: ["findManyUsers", userSearchTerm],
        queryFn: async () => {
            const filter: Record<string, any> = {};

            if (userSearchTerm.trim() !== "") {
                filter["name"] = { $regex: userSearchTerm, $options: "i" };
            }

            const { docs } = await findManyUser(filter);
            return docs;
        },
    });

    const toggleModal = () => setIsModalOpen((prev) => !prev);

    const onSubmit = handleSubmit((data) => {
        const params: Record<
            string,
            string | boolean | (string | boolean)[] | undefined
        > = {
            name: data.name,
            cpf: removeSpecialCharacters(String(data.cpf)),
            profile_id: [...(data.profile ?? [])?.map(({ id }) => id)].flat(),
            username: data.username,
            email: data.email,
            external: data.external?.map(({ value }) => value),
            active: data.active?.map(({ value }) => value),
        };

        handleParamsChange({ ...params });
        toggleModal();
    });

    const onReset = () => {
        reset();
        handleParamsChange({
            name: "",
            cpf: "",
            profile_id: "",
            username: "",
            email: "",
            active: undefined,
            external: undefined,
        });
    };

    const handleChangeProfileName = useDebounce(
        (e: ChangeEvent<HTMLInputElement>) => {
            handleParamsChange({
                quick: e.target.value,
            });
        },
        300
    );

    const handleSearchUser = useDebounce(
        (input: string) => setUserSearchTerm(input),
        300
    );

    const handleSearchProflile = useDebounce(
        (input: string) => setProfileSearchTerm(input),
        300
    );

    return {
        register,
        control,
        reset,
        setValue,
        watch,
        errors,
        isModalOpen,
        toggleModal,
        profiles,
        users,
        onSubmit,
        onReset,
        handleChangeProfileName,
        handleSearchUser,
        handleSearchProflile,
    };
};
