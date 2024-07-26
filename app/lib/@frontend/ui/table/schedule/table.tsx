"use client";
//tava reclamando da função cell nas colunas

import {
  ICommand,
  IDevice,
  IFirmware,
  ISchedule,
} from "@/app/lib/@backend/domain";
import { columns } from "./columns";
import { DataTable } from "../../data-table";

interface Props {
  data: (ISchedule & {
    device: IDevice;
    command: ICommand;
    firmware?: IFirmware;
  })[];
}
export function ScheduleTable(props: Props) {
  const { data } = props;
  return (
    <DataTable
      columns={columns}
      data={data}
      mobileDisplayValue={(data) => data.id}
      mobileKeyExtractor={(data) => data.created_at?.toISOString()}
      className="w-full mt-10"
    />
  );
}
