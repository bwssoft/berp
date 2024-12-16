"use client";
//tava reclamando da função cell nas colunas

import { IClient, IOpportunity } from "@/app/lib/@backend/domain";
import { columns } from "./columns";
import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";

interface Props {
  data: (IOpportunity & { client: IClient })[];
}
export function ClientOpportunityTable(props: Props) {
  const { data } = props;
  return (
    <DataTable
      columns={columns}
      data={data}
      mobileDisplayValue={(data) =>
        `${data.name} - ${data.client.company_name}`
      }
      mobileKeyExtractor={(data) => data.created_at?.toISOString()}
      className="w-full mt-10"
    />
  );
}
