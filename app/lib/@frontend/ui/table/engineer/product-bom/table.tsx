"use client";

import { columns } from "./columns";
import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";

interface Props {
  data: {
    input: {
      id: string
      name: string
    }
    quantity: number
  }[]
}

export function ProductBOMTable(props: Props) {
  const { data } = props;
  return (
    <DataTable
      columns={columns}
      data={data}
      mobileDisplayValue={(data) => data.input.id}
      mobileKeyExtractor={(data) => data.input.id}
      className="w-full"
    />
  );
}
