"use client";
//tava reclamando da função cell nas colunas

import { IDevice } from "@/app/lib/@backend/domain";
import { columns } from "./columns";
import { DataTable } from "../../data-table";

interface Props {
  data: IDevice[];
}
export function DeviceTable(props: Props) {
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