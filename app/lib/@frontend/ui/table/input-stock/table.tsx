"use client";
//tava reclamando da função cell nas colunas

import { IInput } from "@/app/lib/@backend/domain";
import { columns } from "./columns";
import { DataTable } from "../../data-table";

interface Props {
  data: {
    input: IInput;
    balance: number;
    cumulative_price: number;
  }[];
}
export function InputStockTable(props: Props) {
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
