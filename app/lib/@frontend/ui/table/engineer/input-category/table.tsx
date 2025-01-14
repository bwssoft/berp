"use client";

import { IInputCategory } from "@/app/lib/@backend/domain/engineer/entity/input-category.definition";
import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";
import { inputCategoryColumns } from "./columns";

interface InputCategoryTableProps {
  data: IInputCategory[];
}

export function InputCategoryTable({ data }: InputCategoryTableProps) {
  return (
    <DataTable
      data={data}
      columns={inputCategoryColumns}
      className="w-full"
      mobileDisplayValue={(e) => e.name}
      mobileKeyExtractor={(e) => e.id}
    />
  );
}
