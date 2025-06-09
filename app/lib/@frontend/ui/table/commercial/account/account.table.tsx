"use client";

import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";

import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";
import { Pagination } from "../../../component/pagination";
import { useHandleParamsChange } from "@/app/lib/@frontend/hook";
import { columns } from "./account.columns";

interface Props {
    data: PaginationResult<any>;
    currentPage?: number;
} 

export function AccountTable({ data, currentPage = 1 }: Props) {
    const { docs, pages = 1, total = 0, limit = 10 } = data;
    const { handleParamsChange } = useHandleParamsChange();

    return (
        <div className="w-full">
            <DataTable
                columns={columns()}
                data={docs}
                mobileDisplayValue={(a) => a.name}
                mobileKeyExtractor={(a) => a.id?.toString() ?? ""}
            />

            <Pagination
                currentPage={currentPage}
                totalPages={pages}
                totalItems={total}
                limit={limit}
                onPageChange={(page) => handleParamsChange({ page })}
            />
        </div>
    );
}
