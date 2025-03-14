"use client";

import { columns } from "./columns";
import { DataTable } from "../../../component";
import { ISerialPort } from "@/app/lib/@frontend/hook/use-serial-port";

interface Props {
  data: {
    imei?: string;
    iccid?: string;
    et?: string;
    port: ISerialPort;
  }[];
}
export function DevicesToAutoTestTable(props: Props) {
  const { data } = props;
  return (
    <DataTable
      columns={columns}
      data={data}
      mobileDisplayValue={(data) => data.imei}
      mobileKeyExtractor={() => Math.random().toString()}
      className="w-full"
    />
  );
}
