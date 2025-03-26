import { ColumnDef } from "@tanstack/react-table";
import { toast } from "@/app/lib/@frontend/hook";
import { IProductCategory } from "@/app/lib/@backend/domain";
import { deleteOneProductCategoryById } from "@/app/lib/@backend/action";

export const columns: ColumnDef<IProductCategory>[] = [
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
          <form
            action={async () => {
              try {
                await deleteOneProductCategoryById({ id: input.id! });
                toast({
                  variant: "success",
                  title: "Sucesso!",
                  description: "Categoria de produto deletada com sucesso.",
                });
              } catch (e) {
                toast({
                  variant: "error",
                  title: "Erro!",
                  description: "Falha ao deletar a categoria de produto.",
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
