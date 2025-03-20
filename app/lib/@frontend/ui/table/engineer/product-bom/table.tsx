"use client";

import { columns } from "./columns";
import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";

interface Props {
  data: {
    input_id: string;
    input_name: string;
    quantity: number;
  }[];
}

export function ProductBOMTable(props: Props) {
  const { data } = props;
  return (
    <DataTable
      columns={columns}
      data={data}
      mobileDisplayValue={(data) => data.input_id}
      mobileKeyExtractor={(data) => data.input_id}
      className="w-full"
    />
  );
}
