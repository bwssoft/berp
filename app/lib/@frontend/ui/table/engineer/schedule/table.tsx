"use client";
//tava reclamando da função cell nas colunas

import { ICommand } from "@/backend/domain/engineer/entity/command.definition";
import { IDevice } from "@/backend/domain/engineer/entity/device.definition";
import { ISchedule } from "@/backend/domain/engineer/entity/command-schedule.definition";
import { IFirmware } from "@/backend/domain/engineer/entity/firmware.definition";
import { columns } from "./columns";
import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";

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
