"use client";

import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";
import { IComponentCategory } from "@/app/lib/@backend/domain";
import { componentCategoryColumns } from "./component.category.columns";

interface ComponentCategoryTableProps {
  data: IComponentCategory[];
}

export function ComponentCategoryTable({ data }: ComponentCategoryTableProps) {
  return (
    <DataTable
      data={data}
      columns={componentCategoryColumns}
      className="w-full"
      mobileDisplayValue={(e) => e.name}
      mobileKeyExtractor={(e) => e.id}
    />
  );
}
