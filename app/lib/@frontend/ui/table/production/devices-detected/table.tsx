"use client";

import { getColumns, Row } from "./columns";
import { DataTable } from "../../../component";
import { Device } from "@/app/lib/@backend/domain";

interface Props {
  data: Row[];
  model: Device.Model;
}
export function DevicesDetectedTable(props: Props) {
  const { data, model } = props;
  return (
    <DataTable
      columns={getColumns(model)}
      data={data}
      mobileDisplayValue={(data) => data.equipment.imei}
      mobileKeyExtractor={() => Math.random().toString()}
      className="w-full"
    />
  );
}
