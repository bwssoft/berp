"use client";

import { IAccountAttachment } from "@/app/lib/@backend/domain";
import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";
import { columns } from "./columns";

interface Props {
  data: IAccountAttachment[];
}
export function AccountAttachmentsTable(props: Props) {
  const { data } = props;
  return (
    <DataTable
      columns={columns}
      data={data}
      mobileDisplayValue={(data) => data.name}
      mobileKeyExtractor={(data) => data.createdAt.toString()}
      className="w-full mt-10"
    />
  );
}
