"use client";

import { columns } from "./columns";
import { DataTable } from "../../../component";

interface Props {
  data: {
    equipment: {
      imei: string;
      et: string;
      iccid?: string;
    };
    is_successful: boolean;
  }[];
}
export function DevicesAutoTestedTable(props: Props) {
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
