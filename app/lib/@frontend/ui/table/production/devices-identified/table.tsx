"use client";

import { columns } from "./columns";
import { DataTable } from "../../../component";
import { Device } from "@/app/lib/@backend/domain";

interface Props {
  data: {
    equipment_before: {
      serial: string;
      imei?: string;
    };
    equipment_after?: {
      imei?: string;
      serial?: string;
    };
    status: boolean;
    id: string;
    created_at: Date;
    technology: {
      system_name: Device.Model;
    };
  }[];
}
export function DevicesIdentifiedTable(props: Props) {
  const { data } = props;
  return (
    <DataTable
      columns={columns}
      data={data}
      mobileDisplayValue={(data) => data.equipment_before.serial}
      mobileKeyExtractor={() => Math.random().toString()}
      className="w-full"
    />
  );
}
