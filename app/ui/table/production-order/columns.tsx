import { deleteOneProductionOrderById } from "@/app/lib/action/production-order.action";
import { IProductionOrder } from "@/app/lib/definition";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<IProductionOrder>[] = [
  { header: "Estágio", accessorKey: "stage" },
  {
    header: "Tipos de Produtos",
    accessorKey: "products",
    cell: ({ row }) => {
      const productionOrder = row.original;
      return productionOrder.products.length;
    },
  },
  {
    header: "Quantidade total",
    accessorKey: "products",
    cell: ({ row }) => {
      const productionOrder = row.original;
      return productionOrder.products.reduce(
        (acc, cur) => (acc += cur.quantity),
        0
      );
    },
  },
  {
    header: "Criado em",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const productionOrder = row.original;
      return productionOrder.created_at.toLocaleString();
    },
  },
  {
    header: "",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const productionOrder = row.original;
      return (
        <td className="flex gap-2 relative whitespace-nowrap pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
          <Link
            href={`/production-order/form/update?id=${productionOrder.id}`}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Editar
          </Link>
          <form
            action={() =>
              deleteOneProductionOrderById({ id: productionOrder.id! })
            }
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
