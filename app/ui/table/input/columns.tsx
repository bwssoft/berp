import { deleteOneInputById } from "@/app/lib/action";
import { IInput } from "@/app/lib/definition";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "../../button";

export const columns: ColumnDef<IInput>[] = [
  { header: "Nome", accessorKey: "name" },
  {
    header: "Unidade de medida",
    accessorKey: "measure_unit",
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
            href={`/input/update?id=${input.id}`}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Editar
          </Link>
          <form action={() => deleteOneInputById({ id: input.id! })}>
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
