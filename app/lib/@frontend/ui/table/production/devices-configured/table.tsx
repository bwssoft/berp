"use client";

import { DataTable } from "../../../component";
import { columns } from "./columns";

interface Props {
  data: {
    id: string;
    equipment: {
      firmware: string;
      serial: string;
      iccid?: string;
    };
    status: boolean;
    profile: {
      name: string;
      id: string;
    };
    created_at: Date;
    technology: {
      system_name: string;
    };
  }[];
}
export function DevicesConfiguredTable(props: Props) {
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
