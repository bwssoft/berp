"use client";

import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";
import { serviceColumns } from "./services.columns";
import {IPriceTableService} from "@/app/lib/@backend/domain/commercial/entity/price-table-service.definition";
import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";
import { Pagination } from "../../../component/pagination";
import { useSearchParams } from "next/navigation";
import { useHandleParamsChange } from "@/app/lib/@frontend/hook/use-handle-params-change";

interface ServiceTableProps {
  data: PaginationResult<IPriceTableService>;
  onDelete: (service: IPriceTableService) => void;
  onPageChange?: (page: number) => void;
}

export function ServiceTable({
  data,
  onDelete,
  onPageChange,
}: ServiceTableProps) {
  const PAGE_SIZE = 10;

  const { docs, pages = 1, total = 0, limit = PAGE_SIZE } = data ?? {};
  const safeDocs = docs ?? [];
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? Math.max(1, Number(pageParam)) : 1;

  const { handleParamsChange } = useHandleParamsChange();
  const handlePageChange = (page: number) => {
    handleParamsChange({ page });
    onPageChange?.(page);
  };

  return (
    <div>
      <DataTable
        columns={serviceColumns(onDelete)}
        data={safeDocs}
        mobileDisplayValue={(s) => s.name}
        mobileKeyExtractor={(s) => s.id!}
        className="w-full"
      />
      <Pagination
        currentPage={currentPage}
        totalPages={pages}
        totalItems={total}
        limit={limit}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
