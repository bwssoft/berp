"use client";

import { IAudit } from "@/app/lib/@backend/domain";
import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";
import { columns } from "./audit.columns";
import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";
import { useSearchParams } from "next/navigation";
import { useHandleParamsChange } from "@/app/lib/@frontend/hook";
import { Pagination } from "../../../component/pagination";

const PAGE_SIZE = 10;

interface AuditTableProps {
  data: PaginationResult<IAudit>;
}

export function AuditTable({ data }: AuditTableProps) {

  const { docs, pages = 1, total = 0, limit = PAGE_SIZE } = data;

  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? Math.max(1, Number(pageParam)) : 1;
  
  const { handleParamsChange } = useHandleParamsChange();
  const handlePageChange = (page: number) => handleParamsChange({ page })
  
  return (
    <div>
      <DataTable
        columns={columns}
        data={docs}
        mobileDisplayValue={(audit) => `${audit.action} - ${audit.user.name}`}
        mobileKeyExtractor={(audit) => audit.created_at?.toISOString()}
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
