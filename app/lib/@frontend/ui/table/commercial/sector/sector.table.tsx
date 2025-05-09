"use client";

import { useState } from "react";
import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";
import { ISector, sectorColumns } from "./sector.columns";

interface SectorTableProps {
    initialData: ISector[];
}

export function SectorTable({ initialData }: SectorTableProps) {
    const [data, setData] = useState<ISector[]>(initialData);

    const handleToggle = (sector: ISector) =>
        setData((prev) =>
            prev.map((s) =>
                s.id === sector.id ? { ...s, active: !s.active } : s
            )
        );

    return (
        <DataTable
            columns={sectorColumns(handleToggle)}
            data={data}
            mobileDisplayValue={(s) => s.name}
            mobileKeyExtractor={(s) => s.id}
            className="w-full"
        />
    );
}
