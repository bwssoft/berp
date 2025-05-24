"use client";

import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";
import { IBase } from "@/app/lib/@backend/domain";
import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";
import { columns } from "./base.columns";
import { Pagination } from "../../../component/pagination";
import { useHandleParamsChange } from "@/app/lib/@frontend/hook";
import { useAuth } from "@/app/lib/@frontend/context";

const PAGE_SIZE = 10;

interface Props {
  data: PaginationResult<IBase>;
  currentPage?: number;
}

export function BaseTable({ data, currentPage = 1 }: Props) {
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
          mobileDisplayValue={(u) => u.code}
          mobileKeyExtractor={(u) => u.id.toString()}
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
