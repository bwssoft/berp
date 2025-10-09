"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {IPriceTableService} from "@/app/lib/@backend/domain/commercial/entity/price-table-service.definition";
import {
  createOnePriceTableService,
  findManyPriceTableService,
  deletePriceTableService,
} from "@/app/lib/@backend/action/commercial/price-table-service.action";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";

const ServiceSchema = z.object({ name: z.string().trim().min(1) });
type ServiceForm = z.infer<typeof ServiceSchema>;

export function useServiceModal() {
  const [open, setOpen] = useState(false);
  const [pagination, setPagination] = useState<
    PaginationResult<IPriceTableService>
  >({
    docs: [],
    total: 0,
    pages: 1,
    limit: 10,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ServiceForm>({
    resolver: zodResolver(ServiceSchema),
    defaultValues: { name: "" },
  });

  const fetchServices = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const result = await findManyPriceTableService({}, page);

      if ("data" in result && result.success) {
        setPagination(
          result.data ?? { docs: [], total: 0, pages: 1, limit: 10 }
        ); // garante que nunca será undefined
      } else {
        toast({
          title: "Erro ao buscar serviços",
          description: result.error ?? "Erro desconhecido",
          variant: "error",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao buscar serviços",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices(currentPage);
  }, [currentPage, fetchServices]);

  const addService = useCallback(
    async ({ name }: ServiceForm) => {
      const result = await createOnePriceTableService({ name, active: true });

      if ("error" in result) {
        toast({
          title: "Erro",
          description: result.error,
          variant: "error",
        });
        return;
      }

      await fetchServices(currentPage);
      reset();
      toast({ title: "Serviço criado com sucesso!", variant: "success" });
    },
    [currentPage, fetchServices, reset]
  );

  const removeService = useCallback(
    async (service: IPriceTableService) => {
      try {
        await deletePriceTableService(service.id!);
        await fetchServices(currentPage);
        toast({ title: "Serviço excluído com sucesso!", variant: "success" });
      } catch (error) {
        toast({
          title: "Erro ao excluir serviço",
          description:
            error instanceof Error ? error.message : "Erro desconhecido",
          variant: "error",
        });
      }
    },
    [currentPage, fetchServices]
  );

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  return {
    open,
    openModal,
    closeModal,
    isLoading,
    register,
    errors,
    handleAdd: handleSubmit(addService),
    isPending: isSubmitting,
    onAskDelete: removeService,
    pagination,
    currentPage,
    setCurrentPage,
    refreshServices: fetchServices,
  };
}
