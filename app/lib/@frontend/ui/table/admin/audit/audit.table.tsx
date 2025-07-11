"use client";

import { IAudit } from "@/app/lib/@backend/domain";
import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";
import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";
import { Pagination } from "../../../component/pagination";
import { columns } from "./audit.columns";

const PAGE_SIZE = 10;

interface AuditTableProps {
  data: PaginationResult<IAudit>;
  currentPage: number;
  handlePageChange: (page: number) => void;
}

export function AuditTable({
  data,
  currentPage,
  handlePageChange,
}: AuditTableProps) {
  return (
    <div className="flex flex-col w-full">
      <DataTable
        columns={columns}
        data={data.docs}
        mobileDisplayValue={(audit) => `${audit.action} - ${audit.user.name}`}
        mobileKeyExtractor={(audit) => audit.created_at?.toISOString()}
        className="h-96"
      />

      <Pagination
        currentPage={currentPage}
        totalPages={data.pages || 1}
        totalItems={data.total || 0}
        limit={data.limit || PAGE_SIZE}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
