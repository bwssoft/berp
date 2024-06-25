import { IInput } from "@/app/lib/definition";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<{
  input: IInput;
  cumulative_balance: number;
  cumulative_price: number;
}>[] = [
  {
    header: "Insumo",
    accessorKey: "input",
    cell: ({ row }) => {
      const stock = row.original;
      return stock.input.name;
    },
  },
  {
    header: "Quantidade",
    accessorKey: "cumulative_balance",
  },
  {
    header: "Preço un.",
    accessorKey: "cumulative_price",
    cell: ({ row }) => {
      const stock = row.original;
      return (
        <td className="flex gap-2 relative whitespace-nowrap pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
          R$ {stock.input.price.toFixed(2)}
        </td>
      );
    },
  },
  {
    header: "Valor total em estoque",
    accessorKey: "cumulative_price",
    cell: ({ row }) => {
      const stock = row.original;
      return (
        <td className="flex gap-2 relative whitespace-nowrap pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
          R$ {stock.cumulative_price.toFixed(2)}
        </td>
      );
    },
  },
  {
    header: "",
    accessorKey: "input",
    cell: ({ row }) => {
      const stock = row.original;
      return (
        <td className="flex gap-2 relative whitespace-nowrap pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
          <Link
            href={`/input/analysis?id=${stock.input.id}`}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Analisar
          </Link>
        </td>
      );
    },
  },
];
