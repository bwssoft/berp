"use client";
//tava reclamando da função cell nas colunas

import { IProduct } from "@/app/lib/@backend/domain";
import { columns } from "./columns";
import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";

interface Props {
  data: {
    product: IProduct;
    balance: number;
    unit_cost: number;
    total_cost: number;
  }[];
}
export function ProductStockTable(props: Props) {
  const { data } = props;
  return (
    <DataTable
      columns={columns}
      data={data}
      mobileDisplayValue={(data) => `${data.product.name}: ${data.balance}`}
      mobileKeyExtractor={(data) => data.product.id!}
      className="w-full"
    />
  );
}
