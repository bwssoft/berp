"use client";

import { columns } from "./columns";
import { DataTable } from '@/frontend/ui/component/data-table';

import { Device } from "@/app/lib/@backend/domain";

interface Props {
  data: {
    id: string;
    equipment: {
      serial: string;
      firmware: string;
      imei?: string;
      iccid?: string;
    };
    status: boolean;
    created_at: Date;
    technology: {
      system_name: Device.Model;
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
