"use client";
//tava reclamando da função cell nas colunas

import { columns } from "./columns";
import { DataTable } from "../../data-table";
import { IProduct, IProposal } from "@/app/lib/@backend/domain";
import { UseFormRegister } from "react-hook-form";
import { ClientProposalSchema } from "../../form/client-proposal/update/use-client-proposal-update-form";

interface Props {
  data: NonNullable<IProposal["billing_process"]>[string];
  register: UseFormRegister<ClientProposalSchema>;
  scenario: IProposal["scenarios"][number];
  products: IProduct[];
}
export function SaleProposalBillingProcess(props: Props) {
  const { data, register, scenario, products } = props;
  return (
    <DataTable
      columns={columns({ register, scenario, products })}
      data={data}
      mobileDisplayValue={(data) => `${data.line_item_id.join(", ")}`}
      mobileKeyExtractor={(data) => data.id}
      className="w-full"
    />
  );
}
