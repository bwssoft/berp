import { deleteOneProductById } from "@/app/lib/@backend/action";
import { IProduct } from "@/app/lib/@backend/domain";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { toast } from "../../../hook";

export const columns: ColumnDef<IProduct>[] = [
  { header: "Nome", accessorKey: "name" },
  {
    header: "Quant. Insumos",
    accessorKey: "inputs",
    cell: ({ row }) => {
      const product = row.original;
      return Math.ceil(Math.random()); // TO DO - Modificar pra pegar os dados da ficha técnica e trazer a quantidade total de insumos
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
            href={`/product/form/update?id=${product.id}`}
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
