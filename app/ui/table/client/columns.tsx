import { clientConstants } from "@/app/constant";
import { deleteOneClientById } from "@/app/lib/action";
import { IClient } from "@/app/lib/definition";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<IClient>[] = [
  { header: "Razão Social", accessorKey: "corporate_name" },
  {
    header: "Documento",
    accessorKey: "document",
  },
  {
    header: "Setor",
    accessorKey: "sector",
    cell: ({ row }) => {
      const client = row.original;
      return clientConstants.sectors[client.sector];
    },
  },
  {
    header: "Criado em",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const iput = row.original;
      return iput.created_at.toLocaleString();
    },
  },
  {
    header: "",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const input = row.original;
      return (
        <td className="flex gap-2 relative whitespace-nowrap pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
          <Link
            href={`/sale/client/form/update?id=${input.id}`}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Editar
          </Link>
          <form action={() => deleteOneClientById({ id: input.id! })}>
            <button
              type="submit"
              className="text-indigo-600 hover:text-indigo-900 px-0 py-0"
            >
              Deletar
            </button>
          </form>
        </td>
      );
    },
  },
];
