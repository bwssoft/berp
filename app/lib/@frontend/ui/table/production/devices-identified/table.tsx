"use client";

import { columns } from "./columns";
import { DataTable } from "../../../component";

interface Props {
  data: {
    equipment: {
      imei: string;
      serial: string;
    };
    identifitaction?: {
      imei?: string;
      serial?: string;
    };
    status: boolean;
    id: string;
    created_at: Date;
    technology: {
      system_name: string;
    };
  }[];
}
export function DevicesIdentifiedTable(props: Props) {
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
