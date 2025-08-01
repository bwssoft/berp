"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useDebounce } from "@/app/lib/@frontend/hook/use-debounce";
import { findManyProfile } from "@/app/lib/@backend/action/admin/profile.action";
import { findManyUser } from "@/app/lib/@backend/action/admin/user.action";
import { useHandleParamsChange } from "@/app/lib/@frontend/hook/use-handle-params-change";

const schema = z.object({
  quick: z.string().optional(),

  profile: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .optional(),

  user: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        profile: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
          })
        ),
      })
    )
    .optional(),

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
      profile: [],
      user: [],
      active: undefined,
      quick: "",
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
      profile_id: [
        ...(data.profile ?? [])?.map(({ id }) => id),
        ...(data.user ?? [])?.map(({ profile }) => profile.map(({ id }) => id)),
      ].flat(),
      active: data.active?.map(({ value }) => value),
    };

    handleParamsChange({ ...params });
    toggleModal();
  });

  const onReset = () => {
    reset();
    handleParamsChange({
      profile_id: "",
      active: undefined,
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
