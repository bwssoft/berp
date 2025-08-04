"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ISector } from "@/app/lib/@backend/domain/commercial/entity/sector.definition";
import {
  createOneSector,
  findManySector,
  updateOneSector,
} from "@/app/lib/@backend/action/commercial/sector.action";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";

const SectorSchema = z.object({ name: z.string().trim().min(1) });
type SectorForm = z.infer<typeof SectorSchema>;

export function useSectorModal() {
  const [open, setOpen] = useState(false);
  const [sectors, setSectors] = useState<ISector[]>([]);
  const [enabledSectors, setEnabledSectors] = useState<ISector[]>([]);

  const [pagination, setPagination] = useState<PaginationResult<ISector>>({
    docs: [],
    total: 0,
    pages: 1,
    limit: 10,
  });

  const [currentPage, setCurrentPage] = useState(1);

  const [updatedSectors, setUpdatedSectors] = useState<Record<string, boolean>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SectorForm>({
    resolver: zodResolver(SectorSchema),
    defaultValues: { name: "" },
  });

  const fetchSectors = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const result = await findManySector({ filter: {}, page });
      setPagination(result);
      setSectors(result.docs);
      setEnabledSectors(result.docs.filter((s) => s.active));
    } catch (error) {
      toast({
        title: "Erro ao buscar setores",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSectors(currentPage);
  }, [currentPage, fetchSectors]);

  const handleToggle = useCallback((sector: ISector) => {
    const newActive = !sector.active;

    setSectors((prev) => {
      const newSectors = prev.map((s) =>
        s.id === sector.id ? { ...s, active: newActive } : s
      );
      setEnabledSectors(newSectors.filter((s) => s.active));
      return newSectors;
    });

    setUpdatedSectors((prev) => ({
      ...prev,
      [sector.id]: newActive,
    }));
  }, []);

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  const handleSave = useCallback(async () => {
    try {
      const updates = Object.entries(updatedSectors);
      for (const [id, active] of updates) {
        await updateOneSector({ id }, { active });
      }
      setUpdatedSectors({});
      toast({
        title: "Sucesso!",
        variant: "success",
      });
      await fetchSectors(currentPage);
      closeModal();
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
        variant: "error",
      });
    }
  }, [updatedSectors, currentPage, fetchSectors, closeModal]);

  const addSector = useCallback(
    async ({ name }: SectorForm) => {
      try {
        await createOneSector({ name, active: true });
        await fetchSectors(currentPage);
        reset();
        closeModal();
      } catch (error) {
        toast({
          title: "Erro ao criar setor",
          description:
            error instanceof Error ? error.message : "Erro desconhecido",
          variant: "error",
        });
      }
    },
    [currentPage, fetchSectors, reset, closeModal]
  );

  return {
    open,
    openModal,
    closeModal,
    sectors,
    enabledSectors,
    isLoading,
    register,
    errors,
    handleAdd: handleSubmit(addSector),
    isPending: isSubmitting,
    handleToggle,
    handleSave,
    updatedSectors,
    pagination,
    currentPage,
    setCurrentPage,
  };
}
