// ContactTable.tsx
"use client";

import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";
import { ContactItem } from "../../../form/commercial/account/contact/create/use-contact.create.account";
import { columnsContact } from "./contact.columns";

interface Props {
  data: ContactItem[];
  handlePreferredContact: (
    index: number,
    key: keyof ContactItem["preferredContact"]
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
      columns={columnsContact({
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
