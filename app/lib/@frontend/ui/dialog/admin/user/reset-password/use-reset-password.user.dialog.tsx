"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { resetPasswordUser } from "@/app/lib/@backend/action/admin/user.action";
import { toast } from "@/app/lib/@frontend/hook";

interface Params {
  userId: string;
  onSuccess?: () => void;
}

export function useResetPasswordUserDialog({ userId, onSuccess }: Params) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const qc = useQueryClient();

  const confirm = async () => {
    setIsLoading(true);
    try {
      await resetPasswordUser({ id: userId });

      toast({
        title: "Sucesso!",
        description: "Reset de senha realizado com sucesso.",
        variant: "success",
      });

      qc.invalidateQueries({ queryKey: ["findOneUser", userId] });
      onSuccess?.();
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast({
        title: "Erro",
        description: "Não foi possível resetar a senha do usuário.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    open,
    setOpen,
    openDialog: () => setOpen(true),
    confirm,
    isLoading,
  };
}
