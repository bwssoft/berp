"use client";
//tava reclamando da função cell nas colunas

import { IProduct, IProductTransaction } from "@/app/lib/definition";
import { columns } from "./columns";
import { DataTable } from "../../data-table";

interface Props {
  data: (IProductTransaction & { product: IProduct })[];
}
export default function ProductTransactionTable(props: Props) {
  const { data } = props;
  return (
    <DataTable
      columns={columns}
      data={data}
      mobileDisplayValue={(data) => `${data.quantity} ${data.product.name} `}
      mobileKeyExtractor={(data) => data.created_at?.toISOString()}
      className="w-full mt-10"
    />
  );
}
