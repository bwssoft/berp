"use client";

import { columns } from "./columns";
import { DataTable } from "../../../component";
import { ISerialPort } from "@/app/lib/@frontend/hook/use-serial-port";

interface Props {
  data: {
    equipment: {
      imei?: string | undefined;
      iccid?: string | undefined;
      firmware?: string | undefined;
      serial?: string | undefined;
    };
    status: "fully_identified" | "partially_identified" | "not_identified";
    port: ISerialPort;
  }[];
}
export function DevicesDetectedTable(props: Props) {
  const { data } = props;
  return (
    <DataTable
      columns={columns}
      data={data}
      mobileDisplayValue={(data) => data.equipment.imei}
      mobileKeyExtractor={() => Math.random().toString()}
      className="w-full"
    />
  );
}
