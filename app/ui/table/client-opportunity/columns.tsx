import { deleteOneClientOpportunityById } from "@/app/lib/action";
import { IClient, IClientOpportunity } from "@/app/lib/definition";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<IClientOpportunity & { client: IClient }>[] = [
  { header: "Nome", accessorKey: "name" },
  {
    header: "Tipo",
    accessorKey: "type",
  },
  {
    header: "Fase da Negociação",
    accessorKey: "sales_stage",
  },
  {
    header: "Cliente",
    accessorKey: "client",
    cell: ({ row }) => {
      const opportunity = row.original;
      return opportunity.client.corporate_name;
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
            href={`/sale/opportunity/form/update?id=${input.id}`}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Editar
          </Link>
          <form
            action={() => deleteOneClientOpportunityById({ id: input.id! })}
          >
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
