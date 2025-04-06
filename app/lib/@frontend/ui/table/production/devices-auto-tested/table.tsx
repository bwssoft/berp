"use client";

import { columns } from "./columns";
import { DataTable } from "../../../component";

interface Props {
  data: {
    id: string;
    equipment: {
      imei: string;
      serial: string;
      firmware: string;
      iccid?: string;
    };
    status: boolean;
    created_at: Date;
    technology: {
      system_name: string;
    };
  }[];
}
export function DevicesAutoTestedTable(props: Props) {
  const { data } = props;
  return (
    <DataTable
      columns={columns}
      data={data}
      mobileDisplayValue={(data) => data.equipment.serial}
      mobileKeyExtractor={() => Math.random().toString()}
      className="w-full"
    />
  );
}
