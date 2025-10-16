"use client";

import { PaginationResult } from "@/backend/domain/@shared/repository/pagination.interface";
import {IInput} from "@/backend/domain/engineer/entity/input.definition";
import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";
import { columns } from "./input.columns";
import { Pagination } from "../../../component/pagination";
import { useHandleParamsChange } from "@/app/lib/@frontend/hook/use-handle-params-change";
import { useAuth } from '@/frontend/context/auth.context';


const PAGE_SIZE = 10;

interface Props {
  data: PaginationResult<IInput>;
  currentPage?: number;
}

export function InputTable({ data, currentPage = 1 }: Props) {
  const { docs, pages = 1, total = 0, limit = PAGE_SIZE } = data;

  const { handleParamsChange } = useHandleParamsChange();
  const handlePageChange = (page: number) => handleParamsChange({ page });

  const { restrictFeatureByProfile } = useAuth();

  return (
    <>
      <div className="w-full">
        <DataTable
          columns={columns({
            restrictFeatureByProfile,
          })}
          data={docs}
          mobileDisplayValue={(u) => u.name}
          mobileKeyExtractor={(u) => u.id.toString()}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={pages}
          totalItems={total}
          limit={limit}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
}

