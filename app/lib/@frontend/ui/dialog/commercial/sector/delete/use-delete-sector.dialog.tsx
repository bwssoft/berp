"use client";
import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { deleteOneSector } from "@/app/lib/@backend/action/commercial/sector.action";
import {ISector} from "@/app/lib/@backend/domain/commercial/entity/sector.definition";

export function useSectorDeleteDialog() {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [sectorToDelete, setSectorToDelete] = React.useState<ISector | null>(
    null
  );
  const qc = useQueryClient();

  function openDialog(sector: ISector) {
    setSectorToDelete(sector);
    setOpen(true);
  }
  function closeDialog() {
    setOpen(false);
    setSectorToDelete(null);
  }

  async function deleteSector() {
    if (!sectorToDelete) return;
    setIsLoading(true);
    try {
      await deleteOneSector({ id: sectorToDelete.id });
      qc.invalidateQueries({ queryKey: ["findManySector"] });
      qc.invalidateQueries({ queryKey: ["findOneSector", sectorToDelete.id] });
      toast({
        title: "Sucesso!",
        description: "Setor excluído com sucesso!",
        variant: "success",
      });
      closeDialog();
    } catch (err) {
      console.error("Erro ao excluir setor:", err);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o setor.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return {
    open,
    isLoading,
    sectorToDelete,
    openDialog,
    closeDialog,
    deleteSector,
  };
}
