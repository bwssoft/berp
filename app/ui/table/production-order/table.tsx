"use client";
//tava reclamando da função cell nas colunas

import { IProductionOrder } from "@/app/lib/definition";
import { columns } from "./columns";
import { DataTable } from "../../data-table";

interface Props {
  data: IProductionOrder[];
}
export default function ProductionOrderTable(props: Props) {
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
