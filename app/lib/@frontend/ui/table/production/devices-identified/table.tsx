"use client";

import { columns } from "./columns";
import { DataTable } from "../../../component";

interface Props {
  data: {
    equipment: {
      imei: string;
    };
    current_id?: string;
    is_successful: boolean;
  }[];
}
export function DevicesIdentifiedTable(props: Props) {
  const { data } = props;
  return (
    <DataTable
      columns={columns}
      data={data}
      mobileDisplayValue={(data) => data.equipment.imei}
      mobileKeyExtractor={() => Math.random().toString()}
      className="w-full"
    />
  );
}
