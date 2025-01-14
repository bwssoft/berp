import { IProduct } from "@/app/lib/@backend/domain";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<{
  product: IProduct;
  balance: number;
  unit_cost: number;
  total_cost: number;
}>[] = [
  {
    header: "Produto",
    accessorKey: "product",
    cell: ({ row }) => {
      const stock = row.original;
      return stock.product.name;
    },
  },
  {
    header: "Quantidade",
    accessorKey: "balance",
  },
  {
    header: "Custo un.",
    accessorKey: "unit_cost",
    cell: ({ row }) => {
      const stock = row.original;
      return (
        <td className="flex gap-2 relative whitespace-nowrap pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
          R$ {stock.unit_cost.toFixed(2)}
        </td>
      );
    },
  },
  {
    header: "Custo total",
    accessorKey: "total_cost",
    cell: ({ row }) => {
      const stock = row.original;
      return (
        <td className="flex gap-2 relative whitespace-nowrap pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
          R$ {stock.total_cost.toFixed(2)}
        </td>
      );
    },
  },
  {
    header: "",
    accessorKey: "product",
    cell: ({ row }) => {
      const stock = row.original;
      return (
        <td className="flex gap-2 relative whitespace-nowrap pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
          <Link
            href={`/product/analysis?id=${stock.product.id}`}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Analisar
          </Link>
        </td>
      );
    },
  },
];
