"use client";
import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";
import { columns } from "./colums";
import { ContactList, useContactAccount } from "../../../form";

interface Props {
  data: ContactList[];
}
export function ContactTable(props: Props) {
  const { data } = props;
  const { handlePreferredContact } = useContactAccount();

  return (
    <DataTable
      columns={columns({
        handlePreferredContact,
      })}
      data={data}
      mobileDisplayValue={() => `${data}`}
      mobileKeyExtractor={(data) => data.contact}
      className="w-full mt-10"
    />
  );
}
