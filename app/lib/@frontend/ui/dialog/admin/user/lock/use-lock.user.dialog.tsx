"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { lockUser } from "@/app/lib/@backend/action/admin/user.action";
import { toast } from "@/app/lib/@frontend/hook";

interface Params {
  userId: string;
  willLock: boolean;
  onSuccess?: () => void;
}

export function useLockUserDialog({ userId, willLock, onSuccess }: Params) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const qc = useQueryClient();

  const confirm = async () => {
    setIsLoading(true);
    try {
      await lockUser({ id: userId, lock: willLock });

      toast({
        title: "Sucesso!",
        description: willLock
          ? "Usuário bloqueado com sucesso."
          : "Usuário desbloqueado com sucesso.",
        variant: "success",
      });

      qc.invalidateQueries({ queryKey: ["findOneUser", userId] });
      onSuccess?.();
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o estado do usuário.",
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
