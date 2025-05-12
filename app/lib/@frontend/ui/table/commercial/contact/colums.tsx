import { deleteOneProposalById } from "@/app/lib/@backend/action";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ContactList } from "../../../form/commercial/account/create/use-contact.account";
import { TrashIcon } from "@heroicons/react/20/solid";

export const columns: ColumnDef<ContactList>[] = [
  {
    header: "Tipo",
    accessorKey: "type",
    cell: ({ row }) => {
      const contact = row.original;
      return contact.type;
    },
  },
  {
    header: "Contato",
    accessorKey: "contact",
    cell: ({ row }) => {
      const contact = row.original;
      return contact.contact;
    },
  },
  {
    header: "Contato preferencial",
    accessorKey: "preferredContact",
    cell: ({ row }) => {
      const contact = row.original;
      return contact.preferredContact;
    },
  },
  {
    header: "Ações",
    accessorKey: "id",
    cell: ({ row }) => {
      const contact = row.original;
      return (
        <td className="flex gap-2 relative whitespace-nowrap pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
          <form action={() => console.log({ id: contact.id! })}>
            <button
              type="submit"
              className="text-gray-600 hover:text-blue-900 px-0 py-0"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </form>
        </td>
      );
    },
  },
];
