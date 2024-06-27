"use client";
//tava reclamando da função cell nas colunas

import { IInput } from "@/app/lib/definition";
import { columns } from "./columns";
import { DataTable } from "../../data-table";

interface Props {
  data: {
    input: IInput;
    balance: number;
    cumulative_price: number;
  }[];
}
export default function StockTable(props: Props) {
  const { data } = props;
  return (
    <DataTable
      columns={columns}
      data={data}
      mobileDisplayValue={(data) => `${data.input.name}: ${data.balance}`}
      mobileKeyExtractor={(data) => data.input.id!}
      className="w-full"
    />
  );
}
