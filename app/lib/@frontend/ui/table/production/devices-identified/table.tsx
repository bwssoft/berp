"use client";

import { columns } from "./columns";
import { DataTable } from "../../../component";

interface Props {
  data: {
    before: {
      imei: string;
      serial: string;
    };
    after?: {
      imei?: string;
      serial?: string;
    };
    status: boolean;
    id: string;
    created_at: Date;
  }[];
}
export function DevicesIdentifiedTable(props: Props) {
  const { data } = props;
  return (
    <DataTable
      columns={columns}
      data={data}
      mobileDisplayValue={(data) => data.before.serial}
      mobileKeyExtractor={() => Math.random().toString()}
      className="w-full"
    />
  );
}
