"use client";

import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useDebounce, useHandleParamsChange } from "@/app/lib/@frontend/hook";
import { findManyProfile } from "@/app/lib/@backend/action";
import { removeSpecialCharacters } from "@/app/lib/util/removeSpecialCharacters";

const schema = z.object({
    quick: z.string().optional(),

    name: z.string().optional(),
    cpf: z.string().optional(),
    profile_id: z.array(z.string()).optional(),
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

export type SearchUserFormValues = z.infer<typeof schema>;

export const useSearchUserForm = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchProfileTerm, setSearchProfileTerm] = useState<string>("");

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        control,
        watch,
        formState: { errors },
    } = useForm<SearchUserFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            cpf: "",
            profile_id: [],
            username: "",
            email: "",
            active: undefined,
            external: undefined,
        },
    });

    const { handleParamsChange } = useHandleParamsChange();

    const { data: profiles = [] } = useQuery({
        queryKey: ["findManyProfiles", searchProfileTerm],
        queryFn: async () => {
            const filter: Record<string, any> = {};

            if (searchProfileTerm.trim() !== "") {
                filter["name"] = { $regex: searchProfileTerm, $options: "i" };
            }

            const { docs } = await findManyProfile(filter, 1, 0);
            return docs;
        },
    });

    const filteredProfiles = searchProfileTerm
        ? profiles.filter((profile) =>
              profile.name
                  .toLowerCase()
                  .includes(searchProfileTerm.toLowerCase())
          )
        : profiles;

    const handleSearchProfile = (input: string) => {
        setSearchProfileTerm(input);
        handleParamsChange({ page: 1 });
    };
    const toggleModal = () => setIsModalOpen((prev) => !prev);

    const onSubmit = handleSubmit((data) => {
        const params: Record<
            string,
            string | boolean | (string | boolean)[] | undefined
        > = {
            name: data.name,
            cpf: removeSpecialCharacters(String(data.cpf)),
            profile_id: data.profile_id,
            username: data.username,
            email: data.email,
            active: data.active?.map(({ value }) => value),
            external: data.external?.map(({ value }) => value),
        };
        handleParamsChange(params);
        toggleModal();

        console.log(
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            profiles
        );
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

    const handleChangeQuickSearch = useDebounce(
        (e: ChangeEvent<HTMLInputElement>) => {
            handleParamsChange({
                quick: e.target.value,
            });
        },
        300
    );

    return {
        register,
        reset,
        setValue,
        watch,
        errors,
        isModalOpen,
        toggleModal,
        profiles: filteredProfiles,
        handleSearchProfile,
        onSubmit,
        onReset,
        control,
        handleChangeQuickSearch,
    };
};
