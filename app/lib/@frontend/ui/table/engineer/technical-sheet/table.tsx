"use client";
//tava reclamando da função cell nas colunas

import {ITechnicalSheet} from "@/app/lib/@backend/domain/engineer/entity/technical-sheet.definition";
import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";
import { columns } from "./columns";

interface Props {
  data: ITechnicalSheet[];
}
export function TechnicalSheetTable(props: Props) {
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
