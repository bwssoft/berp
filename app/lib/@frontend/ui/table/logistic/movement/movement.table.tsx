"use client";

import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";
import { IMovement } from "@/app/lib/@backend/domain";
import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";
import { columns } from "./movement.columns";
import { Pagination } from "../../../component/pagination";
import { useHandleParamsChange } from "@/app/lib/@frontend/hook/use-handle-params-change";
import { useAuth } from "@/app/lib/@frontend/context";

const PAGE_SIZE = 10;

interface Props {
  data: PaginationResult<IMovement>;
  currentPage?: number;
}

export function MovementTable({ data, currentPage = 1 }: Props) {
  const { docs, pages = 1, total = 0, limit = PAGE_SIZE } = data;
  const { handleParamsChange } = useHandleParamsChange();
  const { restrictFeatureByProfile } = useAuth();

  return (
    <>
      <div className="w-full">
        <DataTable
          columns={columns({
            restrictFeatureByProfile,
          })}
          data={docs}
          mobileDisplayValue={(u) => u.id}
          mobileKeyExtractor={(u) => u.id}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={pages}
          totalItems={total}
          limit={limit}
          onPageChange={(page: number) => handleParamsChange({ page })}
        />
      </div>
    </>
  );
}
