import { deleteOneProductionProcessById } from "@/backend/action/production/production-process.action";
import {ITechnicalSheet} from "@/backend/domain/engineer/entity/technical-sheet.definition";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<ITechnicalSheet>[] = [
  {
    header: "Nome",
    accessorKey: "name",
  },
  {
    header: "Data de criação",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const productionProcess = row.original;
      return productionProcess.created_at.toLocaleString();
    },
  },
  {
    header: "",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const productionProcess = row.original;
      return (
        <td className="flex gap-2 relative whitespace-nowrap pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
          <Link
            href={`/technical-sheet/form/update?id=${productionProcess.id}`}
            className="text-blue-600 hover:text-blue-900"
          >
            Editar
          </Link>
          <form
            action={() =>
              deleteOneProductionProcessById({ id: productionProcess.id! })
            }
          >
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

