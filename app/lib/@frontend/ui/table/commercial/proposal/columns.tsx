import { deleteOneProposalById } from "@/app/lib/@backend/action";
import { IClient, IProposal } from "@/app/lib/@backend/domain";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<IProposal & { client: IClient }>[] = [
  {
    header: "Número",
    accessorKey: "code",
    cell: ({ row }) => {
      const proposal = row.original;
      return proposal.code;
    },
  },
  {
    header: "Cliente",
    accessorKey: "client",
    cell: ({ row }) => {
      const proposal = row.original;
      return proposal.client.company_name;
    },
  },
  {
    header: "Criado em",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const proposal = row.original;
      return proposal.created_at.toLocaleString();
    },
  },
  {
    header: "",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const proposal = row.original;
      return (
        <td className="flex gap-2 relative whitespace-nowrap pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
          <Link
            href={`/sale/proposal/form/update?id=${proposal.id}`}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Editar
          </Link>
          <form action={() => deleteOneProposalById({ id: proposal.id! })}>
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
