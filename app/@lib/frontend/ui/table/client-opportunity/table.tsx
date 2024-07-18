"use client";
//tava reclamando da função cell nas colunas

import { IClient, IClientOpportunity } from "@/app/@lib/backend/domain";
import { columns } from "./columns";
import { DataTable } from "../../data-table";

interface Props {
  data: (IClientOpportunity & { client: IClient })[];
}
export function ClientOpportunityTable(props: Props) {
  const { data } = props;
  return (
    <DataTable
      columns={columns}
      data={data}
      mobileDisplayValue={(data) =>
        `${data.name} - ${data.client.corporate_name}`
      }
      mobileKeyExtractor={(data) => data.created_at?.toISOString()}
      className="w-full mt-10"
    />
  );
}
