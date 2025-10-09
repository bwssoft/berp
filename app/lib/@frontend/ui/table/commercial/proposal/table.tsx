"use client";
//tava reclamando da função cell nas colunas

import {IClient} from "@/app/lib/@backend/domain/commercial/entity/client.definition";
import {IProposal} from "@/app/lib/@backend/domain/commercial/entity/proposal.definition";
import { columns } from "./columns";
import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";

interface Props {
  data: (IProposal & { client: IClient })[];
}
export function ProposalTable(props: Props) {
  const { data } = props;
  return (
    <DataTable
      columns={columns}
      data={data}
      mobileDisplayValue={(data) => `${data.client.id}`}
      mobileKeyExtractor={(data) => data.created_at?.toISOString()}
      className="w-full mt-10"
    />
  );
}
