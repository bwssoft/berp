"use client";
//tava reclamando da função cell nas colunas

import { IProduct, IProductionOrder } from "@/app/lib/@backend/domain";
import { columns } from "./columns";
import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";

interface Props {
  data: (IProductionOrder & { product?: IProduct })[];
}
export function ProductionOrderTable(props: Props) {
  const { data } = props;
  return (
    <DataTable
      columns={columns}
      data={data}
      mobileDisplayValue={(data) => data.id}
      mobileKeyExtractor={(data) => data.created_at?.toISOString()}
      className="w-full mt-10"
    />
  );
}
