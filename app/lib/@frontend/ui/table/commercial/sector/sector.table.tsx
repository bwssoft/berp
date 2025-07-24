"use client";

import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";
import { sectorColumns } from "./sector.columns";
import { ISector } from "@/app/lib/@backend/domain";
import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";
import { Pagination } from "../../../component/pagination";
import { useSearchParams } from "next/navigation";
import { useHandleParamsChange } from "@/app/lib/@frontend/hook/use-handle-params-change";

interface SectorTableProps {
    data: PaginationResult<ISector>;
    onToggle: (sector: ISector) => void;
}

export function SectorTable({ data, onToggle }: SectorTableProps) {
    const PAGE_SIZE = 10;

    const { docs, pages = 1, total = 0, limit = PAGE_SIZE } = data;

    const searchParams = useSearchParams();
    const pageParam = searchParams.get("page");
    const currentPage = pageParam ? Math.max(1, Number(pageParam)) : 1;

    const { handleParamsChange } = useHandleParamsChange();
    const handlePageChange = (page: number) => handleParamsChange({ page });

    const sortedDocs = [...docs].sort((a, b) =>
        a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" })
    );

    return (
        <div>
            <DataTable
                columns={sectorColumns(onToggle)}
                data={sortedDocs}
                mobileDisplayValue={(s) => s.name}
                mobileKeyExtractor={(s) => s.id}
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
