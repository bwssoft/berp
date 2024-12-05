"use client";
//tava reclamando da função cell nas colunas

import { IInput, IProduct, ITechnicalSheet } from "@/app/lib/@backend/domain";
import { columns } from "./columns";
import { DataTable } from "../../data-table";

type Data = IProduct & {
  technical_sheets: ITechnicalSheet[];
  inputs: IInput[];
};

interface Props {
  data: Data[];
}
export function ProductTable(props: Props) {
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
