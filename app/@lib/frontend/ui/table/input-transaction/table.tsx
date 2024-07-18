"use client";
//tava reclamando da função cell nas colunas

import { IInput, IInputTransaction } from "@/app/@lib/backend/domain";
import { columns } from "./columns";
import { DataTable } from "../../data-table";

interface Props {
  data: (IInputTransaction & { input: IInput })[];
}
export function InputTransactionTable(props: Props) {
  const { data } = props;
  return (
    <DataTable
      columns={columns}
      data={data}
      mobileDisplayValue={(data) => `${data.quantity} ${data.input.name} `}
      mobileKeyExtractor={(data) => data.created_at?.toISOString()}
      className="w-full mt-10"
    />
  );
}
