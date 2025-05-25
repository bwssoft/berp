import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { toast } from "@/app/lib/@frontend/hook";
import { IComponentCategory } from "@/app/lib/@backend/domain";
import { deleteOneComponentCategoryById } from "@/app/lib/@backend/action";

export const componentCategoryColumns: ColumnDef<IComponentCategory>[] = [
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
      const compoment = row.original;
      return (
        <td className="flex gap-2 relative whitespace-nowrap pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
          <Link
            href={`/engineer/compoment/component/form/update?id=${compoment.id}`}
            className="text-blue-600 hover:text-blue-900"
          >
            Editar
          </Link>
          <form
            action={async () => {
              try {
                await deleteOneComponentCategoryById({ id: compoment.id! });
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
