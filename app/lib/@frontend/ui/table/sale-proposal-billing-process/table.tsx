"use client";
//tava reclamando da função cell nas colunas

import { columns } from "./columns";
import { DataTable } from "../../data-table";
import { IProduct, IProposal } from "@/app/lib/@backend/domain";
import { UseFormRegister } from "react-hook-form";
import { ClientProposalSchema } from "../../form/client-proposal/update/use-client-proposal-update-form";

interface Props {
  data: NonNullable<IProposal["scenarios"][number]["billing_process"]>;
  register: UseFormRegister<ClientProposalSchema>;
  scenario: IProposal["scenarios"][number];
  products: IProduct[];
  proposal_id: string;
}
export function SaleProposalBillingProcessTable(props: Props) {
  const { data, register, scenario, products, proposal_id } = props;
  return (
    <DataTable
      columns={columns({ register, scenario, products, proposal_id })}
      data={data}
      mobileDisplayValue={(data) => `${data.line_item_id.join(", ")}`}
      mobileKeyExtractor={(data) => data.id}
      className="w-full"
    />
  );
}
