"use client";

import { IUser } from "@/app/lib/@backend/domain";
import { columns } from "./user.columns";
import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";

interface Props {
  data: IUser[];
}
export function UserTable(props: Props) {
  const { data } = props;
  
  return (
    <DataTable
      columns={columns}
      data={data}
      mobileDisplayValue={(data) => data.name}
      mobileKeyExtractor={(data) => data.created_at?.toISOString()}
      className="w-full"
    />
  );
}
