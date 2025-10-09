"use client";
//tava reclamando da função cell nas colunas

import IDevice from "@/app/lib/@backend/domain/engineer/entity/device.definition";
import IRequestToUpdate from "@/app/lib/@backend/domain/engineer/entity/request-to-update-firmware.definition";
import { columns } from "./columns";
import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";

interface Props {
  data: (IRequestToUpdate & { device: IDevice; firmware: IFirmware })[];
}
export function FirmwareRequestToUpdateTable(props: Props) {
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
