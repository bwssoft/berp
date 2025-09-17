"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { setUserActive } from "@/app/lib/@backend/action/admin/user.action";
import { toast } from "@/app/lib/@frontend/hook/use-toast";

interface Params {
  userId: string;
  willActivate: boolean;
  onSuccess?: () => void;
}

export function useActiveUserDialog({
  userId,
  willActivate,
  onSuccess,
}: Params) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const qc = useQueryClient();

  const confirm = async () => {
    setIsLoading(true);
    try {
      await setUserActive({ id: userId, active: willActivate });

      toast({
        title: "Sucesso!",
        description: willActivate
          ? "Usuário ativado com sucesso."
          : "Usuário inativado com sucesso.",
        variant: "success",
      });

      qc.invalidateQueries({ queryKey: ["findOneUser", userId] });
      qc.invalidateQueries({ queryKey: ["findManyUserAudit", userId] });
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
