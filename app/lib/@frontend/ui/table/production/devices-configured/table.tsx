"use client";

import { DataTable } from "../../../component";
import { columns } from "./columns";

interface Props {
  data: {
    id: string;
    equipment: {
      imei: string;
      serial?: string;
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
      mobileDisplayValue={(data) =>
        `${data.equipment.imei} ${data.status ? "Configurado" : "Não Configurado"}`
      }
      mobileKeyExtractor={() => Math.random().toString()}
      className="mt-5 w-full"
      // theadClassName="[&_tr]:border-b bg-white border-b-1 border-b-gray-200"
    />
  );
}
