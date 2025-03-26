import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { toast } from "@/app/lib/@frontend/hook";
import { IInputCategory } from "@/app/lib/@backend/domain";
import { deleteOneInputCategoryById } from "@/app/lib/@backend/action";

export const inputCategoryColumns: ColumnDef<IInputCategory>[] = [
  {
    header: "Código",
    accessorKey: "code",
  },
  {
    header: "Nome",
    accessorKey: "name",
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
            className="text-blue-600 hover:text-blue-900"
          >
            Editar
          </Link>
          <form
            action={async () => {
              try {
                await deleteOneInputCategoryById({ id: input.id! });
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
