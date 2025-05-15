// ContactTable.tsx
"use client";

import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";
import { ContactList } from "../../../form/commercial/account/contact/create/use-contact.account";
import { columns } from "./colums";

interface Props {
  data: ContactList[];
  handlePreferredContact: (
    index: number,
    key: keyof ContactList["preferredContact"]
  ) => void;
  handleRemove: (index: number) => void;
}

export function ContactTable({
  data,
  handlePreferredContact,
  handleRemove,
}: Props) {
  return (
    <DataTable
      columns={columns({
        handlePreferredContact,
        handleRemove,
      })}
      data={data}
      mobileDisplayValue={(row) => row.contact}
      mobileKeyExtractor={(row) => row.id ?? ""}
      className="w-full mt-10"
    />
  );
}
