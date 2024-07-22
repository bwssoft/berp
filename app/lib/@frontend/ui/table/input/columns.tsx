import { deleteOneInputById } from "@/app/lib/@backend/action";
import { IInput } from "@/app/lib/@backend/domain";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { toast } from "../../../hook";

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
            href={`/input/form/update?id=${input.id}`}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Editar
          </Link>
          <form
            action={() => {
              try {
                deleteOneInputById({ id: input.id! });
                toast({
                  variant: "success",
                  title: "Sucesso!",
                  description: "Insumo deletado com sucesso.",
                });
              } catch (e) {
                toast({
                  variant: "error",
                  title: "Erro!",
                  description: "Falha ao deletar o insummo.",
                });
              }
            }}
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
