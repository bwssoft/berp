import { deleteOneClientById } from "@/app/lib/@backend/action/commercial/client.action";
import {IClient} from "@/app/lib/@backend/domain/commercial/entity/client.definition";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<IClient>[] = [
  { header: "Razão Social", accessorKey: "company_name" },
  {
    header: "Documento",
    accessorKey: "document",
    cell: ({ row }) => {
      const client = row.original;
      return client.document.value;
    },
  },
  {
    header: "Data de criação",
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
            href={`/commercial/client/form/update?id=${input.id}`}
            className="text-blue-600 hover:text-blue-900"
          >
            Editar
          </Link>
          <form onSubmit={() => deleteOneClientById({ id: input.id! })}>
            <button
              type="submit"
              className="text-blue-600 hover:text-blue-900 px-0 py-0"
            >
              Deletar
            </button>
          </form>
        </td>
      );
    },
  },
];
