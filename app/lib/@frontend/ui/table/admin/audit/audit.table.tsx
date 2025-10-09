"use client";

import {IAudit} from "@/backend/domain/admin/entity/audit.definition";
import { PaginationResult } from "@/backend/domain/@shared/repository/pagination.interface";
import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";
import { Pagination } from "../../../component/pagination";
import { Spinner } from "../../../component/spinner";
import { columns } from "./audit.columns";

const PAGE_SIZE = 10;

interface AuditTableProps {
  data: PaginationResult<IAudit>;
  currentPage: number;
  handlePageChange: (page: number) => void;
  isLoading?: boolean;
}

export function AuditTable({
  data,
  currentPage,
  handlePageChange,
  isLoading = false,
}: AuditTableProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col w-full">
        <div className="flex justify-center items-center h-96 bg-white rounded-t-md shadow-md border">
          <div className="flex flex-col items-center gap-3">
            <Spinner size={32} color="text-blue-600" />
            <p className="text-sm text-gray-600">Carregando dados...</p>
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={1}
          totalItems={0}
          limit={PAGE_SIZE}
          onPageChange={handlePageChange}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <DataTable
        columns={columns}
        data={data.docs}
        mobileDisplayValue={(audit) => `${audit.action} - ${audit.user.name}`}
        mobileKeyExtractor={(audit) => audit.created_at?.toISOString()}
        className="h-[70vh] w-[50vw]"
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

