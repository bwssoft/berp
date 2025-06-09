import { IAccountAttachment } from "@/app/lib/@backend/domain";
import { InboxArrowDownIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<IAccountAttachment>[] = [
  {
    header: "Nome",
    accessorKey: "name",
    cell: ({ row }) => {
      const client = row.original;
      return <p className="font-semibold">{client.name}</p>;
    },
  },
  {
    header: "Usuário",
    accessorKey: "userId",
    cell: ({ row }) => {
      const input = row.original;
      return input.userId;
    },
  },
  {
    header: "Data /Hora",
    accessorKey: "createdAt",
    cell: ({ row }) => {
      const input = row.original;
      return input.createdAt.toLocaleString();
    },
  },
  {
    header: "Arquivo",
    accessorKey: "file",
    cell: ({ row }) => {
      const input = row.original;
      return input.file?.name ?? "";
    },
  },
  {
    header: "",
    accessorKey: "id",
    cell: ({ row }) => {
      const input = row.original;
      return (
        <td className="flex gap-2 relative whitespace-nowrap pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
          <Link href={``} className="text-blue-600 hover:text-blue-900">
            <InboxArrowDownIcon className="w-5 h-5" />
          </Link>
          <form
            onSubmit={() => {
              /*deleteOneAccountAttachmentsById({ id: input.id! }) */
            }}
          >
            <button
              type="submit"
              className="text-blue-600 hover:text-blue-900 px-0 py-0"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </form>
        </td>
      );
    },
  },
];
