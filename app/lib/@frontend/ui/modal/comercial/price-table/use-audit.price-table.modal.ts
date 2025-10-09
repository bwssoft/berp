"use client";

import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { findManyAudit } from "@/app/lib/@backend/action/admin/audit.action";
import {AuditDomain} from "@/app/lib/@backend/domain/admin/entity/audit.definition";
import {IPriceTable} from "@/app/lib/@backend/domain/commercial/entity/price-table.definition";

const PAGE_SIZE = 10;

export function useAuditPriceTableModal() {
  const [open, setOpen] = useState(false);
  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);
  const [currentPage, setCurrentPage] = useState(1);

  const [priceTable, setPriceTable] = useState<Pick<IPriceTable, "id" | "name">>();

  const handlePriceTableSelection = useCallback(
    (priceTable: Pick<IPriceTable, "id" | "name">) => {
      setPriceTable(priceTable);
      setOpen(true);
      setCurrentPage(1);
    },
    []
  );

  const {
    data: audits = { docs: [], total: 0, pages: 1 },
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["findManyPriceTableAudit", priceTable, currentPage],
    queryFn: async () => {
      if (!priceTable) return { docs: [], total: 0, pages: 1 };
      
      const filter = {
        domain: AuditDomain.priceTable,
        affected_entity_id: priceTable.id,
      }
      
      return await findManyAudit(filter,
        currentPage, PAGE_SIZE);
    },
  });

  // Função para alterar a páginação
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    open,
    audits,
    openModal,
    closeModal,
    error,
    isLoading,
    handlePriceTableSelection,
    priceTable,
    currentPage,
    handlePageChange,
  };
}
