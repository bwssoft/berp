"use client";
//tava reclamando da função cell nas colunas

import { IClient } from "@/app/@lib/backend/domain";
import { columns } from "./columns";
import { DataTable } from "../../data-table";

interface Props {
  data: IClient[];
}
export function ClientTable(props: Props) {
  const { data } = props;
  return (
    <DataTable
      columns={columns}
      data={data}
      mobileDisplayValue={(data) => data.corporate_name}
      mobileKeyExtractor={(data) => data.created_at?.toISOString()}
      className="w-full mt-10"
    />
  );
}
