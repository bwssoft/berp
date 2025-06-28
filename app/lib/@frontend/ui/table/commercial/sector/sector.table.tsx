"use client";

import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";
import { sectorColumns } from "./sector.columns";
import { ISector } from "@/app/lib/@backend/domain";

interface SectorTableProps {
    data: ISector[];
    onToggle: (sector: ISector) => void;
}

export function SectorTable({ data, onToggle }: SectorTableProps) {
    return (
        <DataTable
            columns={sectorColumns(onToggle)}
            data={data}
            mobileDisplayValue={(s) => s.name}
            mobileKeyExtractor={(s) => s.id}
            className="w-full"
        />
    );
}
