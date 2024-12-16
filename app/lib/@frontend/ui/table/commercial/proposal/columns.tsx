import { deleteOneClientProposalById } from "@/app/lib/@backend/action";
import { IClient, IProposal } from "@/app/lib/@backend/domain";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<IProposal & { client: IClient }>[] = [
  {
    header: "Cliente",
    accessorKey: "client",
    cell: ({ row }) => {
      const input = row.original;
      return input.client.company_name;
    },
  },
  {
    header: "Criado em",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const input = row.original;
      return input.created_at.toLocaleString();
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
            href={`/sale/proposal/form/update?id=${input.id}`}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Editar
          </Link>
          <form action={() => deleteOneClientProposalById({ id: input.id! })}>
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
