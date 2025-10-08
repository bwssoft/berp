import { findOneProfile } from "@/app/lib/@backend/action/admin/profile.action";
import {
  updateOneUser,
  getUserAvatarUrl,
} from "@/app/lib/@backend/action/admin/user.action";
import { useAuth } from '@/frontend/context/auth.context';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { IUser } from "@/app/lib/@backend/domain";

export function useViewOneUserForm(user?: IUser) {
  const { changeProfile, profile, refreshUserData } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();

  const handleChangeProfile = async (id: string) => {
    const profile = await findOneProfile({ id });
    profile && changeProfile(profile);
  };

  useEffect(() => {
    (async () => {
      if (user?.id) {
        const url = await getUserAvatarUrl(user.id);
        setAvatarUrl(url);
      }
    })();
  }, [user?.id]);

  const {
    register,
    handleSubmit: rhfHandleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<{ image?: File[]; profile?: any[] }>({
    defaultValues: {
      profile:
        user?.profile ??
        (profile ? [{ id: profile.id, name: profile.name }] : undefined),
    },
  });

  const handleFileUpload = (files: File[] | null) => {
    // store selected files in form state; upload will be performed on submit
    setValue("image", files ?? undefined, { shouldDirty: true });
  };

  const submit = rhfHandleSubmit(async (data) => {
    if (!user?.id) return;

    const formData = new FormData();
    if (Array.isArray(data.image)) {
      data.image.forEach((f) => formData.append("file", f));
    }

    const { success, error } = await updateOneUser(
      user.id,
      { image: undefined },
      formData
    );

    if (success) {
      const url = await getUserAvatarUrl(user.id);
      setAvatarUrl(url);
      try {
        if (refreshUserData) await refreshUserData();
      } catch (e) {
        /* ignore */
      }
      toast({
        title: "Sucesso!",
        description: "Avatar atualizado.",
        variant: "success",
      });
    } else {
      toast({
        title: "Erro",
        description: error?.global ?? "Falha ao atualizar avatar",
        variant: "error",
      });
    }
  });

  return {
    handleChangeProfile,
    profile,
    avatarUrl,
    handleFileUpload,
    register,
    handleSubmit: submit,
    control,
    errors,
  };
}
