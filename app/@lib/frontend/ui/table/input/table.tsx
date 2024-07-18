"use client";
//tava reclamando da função cell nas colunas

import { IInput } from "@/app/@lib/backend/domain";
import { columns } from "./columns";
import { DataTable } from "../../data-table";

interface Props {
  data: IInput[];
}
export function InputTable(props: Props) {
  const { data } = props;
  return (
    <DataTable
      columns={columns}
      data={data}
      mobileDisplayValue={(data) => data.name}
      mobileKeyExtractor={(data) => data.created_at?.toISOString()}
      className="w-full mt-10"
    />
  );
}
