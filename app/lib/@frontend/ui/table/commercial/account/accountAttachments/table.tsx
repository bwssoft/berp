"use client";

import { IAccountAttachment } from "@/app/lib/@backend/domain";
import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";
import { createColumns } from "./columns";
import { ColumnDef } from "@tanstack/react-table";

interface Props {
  data: IAccountAttachment[];
  onDelete?: (id: string) => Promise<void>;
}
export function AccountAttachmentsTable(props: Props) {
  const { data, onDelete } = props;
  const tableColumns = createColumns(onDelete);
  return (
    <DataTable
      columns={tableColumns}
      data={data}
      mobileDisplayValue={(data) => data.name}
      mobileKeyExtractor={(data) => data.createdAt.toString()}
      className="w-full mt-10"
    />
  );
}
