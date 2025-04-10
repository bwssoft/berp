"use client";

import { toast } from "@/app/lib/@frontend/hook";
import { activeProfile } from "@/app/lib/@backend/action";
import { useCallback, useMemo, useState } from "react";

export function useActiveProfileDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [id, setId] = useState<string>();
  const [activate, setActivate] = useState<boolean>(false);

  const confirm = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    const result = await activeProfile({ id, active: activate });
    if (result.success) {
      toast({
        title: "Sucesso!",
        description: activate
          ? "Perfil ativado com sucesso."
          : "Perfil inativado com sucesso.",
        variant: "success",
      });
      setOpen(false);
    } else {
      toast({
        title: "Error!",
        description: result.error,
        variant: "error",
      });
    }
    setIsLoading(false);
  }, [id, activate]);

  const handleOpen = (id: string, activate: boolean) => {
    setOpen(true);
    setId(id);
    setActivate(activate);
  };

  const values = useMemo(
    () => ({
      open,
      setOpen,
      openDialog: () => setOpen(true),
      confirm,
      isLoading,
      setId,
      setActivate,
      activate,
      handleOpen,
    }),
    [activate, confirm, isLoading, open]
  );

  return values;
}
