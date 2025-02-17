"use client";

import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";
import { columns } from "./columns";

interface Props {
  data: {
    id: string;
    name: string;
    technology: { id: string; name: { brand: string } };
    client: {
      id: string;
      document: { value: string };
      company_name: string;
      trade_name: string;
    };
    validation: {
      by_human: boolean;
      by_system: boolean;
    };
  }[];
}
export default function ConfigurationProfileTable(props: Props) {
  const { data } = props;
  return (
    <DataTable
      columns={columns}
      data={data}
      mobileDisplayValue={(data) => data.name}
      mobileKeyExtractor={() => Math.random().toString()}
      className="w-full mt-10"
    />
  );
}
