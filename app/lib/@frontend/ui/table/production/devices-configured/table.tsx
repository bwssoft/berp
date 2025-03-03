"use client";

import { ISerialPort } from "@/app/lib/@frontend/hook/use-serial-port";
import { DataTable } from "../../../component";
import { columns } from "./columns";

interface Props {
  data: {
    id: string;
    port: ISerialPort;
    imei?: string;
    iccid?: string;
    is_configured: boolean;
    not_configured: any;
    profile_name: string;
    technology_id: string;
  }[];
}
export function DevicesConfiguredTable(props: Props) {
  const { data } = props;
  return (
    <DataTable
      columns={columns}
      data={data}
      mobileDisplayValue={(data) =>
        `${data.imei} ${data.is_configured ? "Configurado" : "Não Configurado"}`
      }
      mobileKeyExtractor={() => Math.random().toString()}
      className="mt-5 w-full"
      // theadClassName="[&_tr]:border-b bg-white border-b-1 border-b-gray-200"
    />
  );
}
