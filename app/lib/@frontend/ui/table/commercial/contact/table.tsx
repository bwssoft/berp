"use client";
//tava reclamando da função cell nas colunas

import { IClient, IProposal } from "@/app/lib/@backend/domain";
import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";
import { columns } from "./colums";
import { ContactList } from "../../../form/commercial/account/create/use-contact.account";

interface Props {
  data: ContactList[];
}
export function ContactTable(props: Props) {
  const { data } = props;
  return (
    <DataTable
      columns={columns}
      data={data}
      mobileDisplayValue={() => `${data}`}
      mobileKeyExtractor={(data) => data.contact}
      className="w-full mt-10"
    />
  );
}
