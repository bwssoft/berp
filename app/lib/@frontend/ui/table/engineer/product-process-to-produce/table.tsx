"use client";

import { IProduct } from "@/app/lib/@backend/domain";
import { columns } from "./columns";
import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";

interface Props {
  data: NonNullable<IProduct["process_execution"]>
}

export function ProductProcessToProduceTable(props: Props) {
  const { data } = props;
  return (
    <DataTable
      columns={columns}
      data={data}
      mobileDisplayValue={(data) => data.step}
      mobileKeyExtractor={(data) => data.step}
      className="w-full"
    />
  );
}
