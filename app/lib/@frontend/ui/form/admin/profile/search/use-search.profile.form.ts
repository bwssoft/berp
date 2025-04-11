"use client";

import { useState, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";

import { useDebounce, useHandleParamsChange } from "@/app/lib/@frontend/hook";
import { findManyProfile } from "@/app/lib/@backend/action";

const schema = z.object({
    quick: z.string().optional(),

    profile_id: z.array(z.string()).optional(),
    username: z.string().optional(),
    active: z
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

export const useSearchProfileForm = () => {
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
            profile_id: [],
            username: "",
            active: undefined,
        },
    });

    const { handleParamsChange } = useHandleParamsChange();

    const { data: profiles = [] } = useQuery({
        queryKey: ["findManyProfiles"],
        queryFn: () => findManyProfile({}),
    });

    const toggleModal = () => setIsModalOpen((prev) => !prev);

    const onSubmit = handleSubmit((data) => {
        const params: Record<
            string,
            string | boolean | (string | boolean)[] | undefined
        > = {
            profile_id: data.profile_id,
            username: data.username,
            active: data.active?.map(({ value }) => value),
        };

        handleParamsChange(params);
        toggleModal();
    });

    const onReset = () => {
        reset();
        handleParamsChange({
            profile_id: "",
            username: "",
            active: undefined,
        });
    };

    const handleChangeProfileName = useDebounce(
        (e: ChangeEvent<HTMLInputElement>) => {
            handleParamsChange({
                profile_name: e.target.value,
            });
        },
        300
    );

    return {
        register,
        control,
        setValue,
        watch,
        errors,
        isModalOpen,
        toggleModal,
        profiles,
        onSubmit,
        onReset,
        handleChangeProfileName,
    };
};
