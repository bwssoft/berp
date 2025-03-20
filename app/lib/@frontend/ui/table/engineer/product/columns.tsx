import { deleteOneProductById } from "@/app/lib/@backend/action";
import { IProduct } from "@/app/lib/@backend/domain";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { toast } from "@/app/lib/@frontend/hook";

export const columns: ColumnDef<IProduct>[] = [
  {
    header: "Nome",
    accessorKey: "name",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div
          className="text-ellipsis whitespace-nowrap overflow-hidden max-w-lg"
          title={product.name}
        >
          {product.name}
        </div>
      );
    },
  },
  {
    header: "Criado em",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const product = row.original;
      return product.created_at.toLocaleString();
    },
  },
  {
    header: "",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <td className="flex gap-2 relative whitespace-nowrap pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
          <Link
            href={`/engineer/product/form/update?id=${product.id}`}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Editar
          </Link>
          <form
            action={async () => {
              try {
                await deleteOneProductById({ id: product.id! });
                toast({
                  variant: "success",
                  title: "Sucesso!",
                  description: "Produto deletado com sucesso.",
                });
              } catch (e) {
                toast({
                  variant: "error",
                  title: "Erro!",
                  description: "Falha ao deletar o produto.",
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
