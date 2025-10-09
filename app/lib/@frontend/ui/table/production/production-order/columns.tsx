import { deleteOneProductionOrderById } from "@/app/lib/@backend/action/production/production-order.action";
import {IProductionOrder} from "@/app/lib/@backend/domain/production/entity/production-order.definition";
import { productionOrderConstants } from "@/app/lib/constant/production-order";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<
  IProductionOrder & { product: { name: string } }
>[] = [
  {
    header: "Número",
    accessorKey: "code",
  },
  {
    header: "Produto",
    accessorKey: "product",
    cell: ({ row }) => {
      const productionOrder = row.original;
      return productionOrder.product?.name ?? "--";
    },
  },
  {
    header: "Estágio",
    accessorKey: "stage",
    cell: ({ row }) => {
      const productionOrder = row.original;
      return productionOrderConstants.stage[productionOrder.stage];
    },
  },
  {
    header: "Prioridade",
    accessorKey: "priority",
    cell: ({ row }) => {
      const productionOrder = row.original;
      return productionOrderConstants.priority[productionOrder.priority];
    },
  },
  {
    header: "Data de criação",
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
            href={`/production/production-order/${productionOrder.id}`}
            className="text-blue-600 hover:text-blue-900"
          >
            Gerenciar
          </Link>
          <form
            action={() =>
              deleteOneProductionOrderById({ id: productionOrder.id! })
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
