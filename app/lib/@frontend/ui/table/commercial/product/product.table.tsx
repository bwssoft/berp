"use client";

import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";
import {IProduct} from "@/app/lib/@backend/domain/commercial/entity/product.definition";
import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";
import { columns } from "./product.columns";
import { Pagination } from "../../../component/pagination";
import { useHandleParamsChange } from "@/app/lib/@frontend/hook/use-handle-params-change";
import { useAuth } from '@/frontend/context/auth.context';


const PAGE_SIZE = 10;

interface Props {
  data: PaginationResult<IProduct>;
  currentPage?: number;
}

export function ProductTable({ data, currentPage = 1 }: Props) {
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
