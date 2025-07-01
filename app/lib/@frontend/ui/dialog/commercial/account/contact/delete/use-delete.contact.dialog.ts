"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/app/lib/@frontend/hook";
import { deleteOneContact } from "@/app/lib/@backend/action/commercial/contact.action";

export function useDeleteContactDialog() {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const qc = useQueryClient();

  const confirm = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteOneContact({ id });

      toast({
        title: "Sucesso!",
        description: "Contato excluído com sucesso!",
        variant: "success",
      });

      qc.invalidateQueries({ queryKey: ["findManyContact", id] });
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o contato.",
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
