"use client";
import { columns } from "./columns";
import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";

interface Props {
  data: {key: string, oldValue: string, newValue: string}[];
}

export function EditedFieldsTable(props: Props) {
  const { data } = props;

  return (
    <DataTable
      columns={columns}
      data={data}
      mobileDisplayValue={(data) => data.key}
      mobileKeyExtractor={(data) => data.newValue}
      className="w-full mt-10"
    />
  );
}
