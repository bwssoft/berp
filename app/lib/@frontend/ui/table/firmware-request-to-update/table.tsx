"use client";
//tava reclamando da função cell nas colunas

import {
  IDevice,
  IFirmware,
  IRequestToUpdate,
} from "@/app/lib/@backend/domain";
import { columns } from "./columns";
import { DataTable } from "../../data-table";

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
