import { IInput } from "@/app/lib/@backend/domain";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { toast } from "@/app/lib/@frontend/hook";
import { deleteOneInputById } from "@/app/lib/@backend/action/engineer/input/input.action";

export const columns: ColumnDef<IInput>[] = [
  {
    header: "Código",
    accessorKey: "code",
    cell: ({ row }) => {
      const input = row.original;
      return `${input.category.toUpperCase()}${input.code
        .toString()
        .padStart(3, "0")}`;
    },
  },
  { header: "Nome", accessorKey: "name" },
  {
    header: "Unidade de medida",
    accessorKey: "measure_unit",
  },
  {
    header: "Data de criação",
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
            href={`/engineer/input/form/update?id=${input.id}`}
            className="text-blue-600 hover:text-blue-900"
          >
            Editar
          </Link>
          <form
            action={async () => {
              try {
                await deleteOneInputById({ id: input.id! });
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
