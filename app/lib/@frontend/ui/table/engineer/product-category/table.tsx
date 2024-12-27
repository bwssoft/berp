"use client";

import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";
import { columns } from "./columns";
import { IProductCategory } from "@/app/lib/@backend/domain";

interface ProductCategoryTableProps {
  data: IProductCategory[];
}

export function ProductCategoryTable({ data }: ProductCategoryTableProps) {
  return (
    <DataTable
      data={data}
      columns={columns}
      className="w-full"
      mobileDisplayValue={(e) => e.name}
      mobileKeyExtractor={(e) => e.id}
    />
  );
}
