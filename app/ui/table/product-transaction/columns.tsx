import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
} from "@heroicons/react/20/solid";

const statuses = {
  enter: "text-green-700 bg-green-50 ring-green-600/20",
  exit: "text-red-700 bg-red-50 ring-red-600/10",
};
const icon = {
  enter: ArrowUpCircleIcon,
  exit: ArrowDownCircleIcon,
};
import { IProduct, IProductTransaction } from "@/app/lib/definition";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/app/util";

const typeMapped = {
  enter: "Entrada",
  exit: "Saída",
};
export const columns: ColumnDef<IProductTransaction & { product: IProduct }>[] =
  [
    {
      header: "Movimento",
      accessorKey: "type",
      cell: ({ row }) => {
        const input = row.original;
        const CurrentIcon = icon[input.type];
        return (
          <div
            className={cn(
              statuses[input.type],
              "flex items-center gap-2 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset w-fit"
            )}
          >
            <CurrentIcon
              className={cn("h-6 w-5 flex-none")}
              aria-hidden="true"
            />
            {typeMapped[input.type]}
          </div>
        );
      },
    },
    {
      header: "Item",
      accessorKey: "input",
      cell: ({ row }) => {
        const transaction = row.original;
        return transaction.product.name;
      },
    },
    {
      header: "Quantidade",
      accessorKey: "quantity",
      cell: ({ row }) => {
        const transaction = row.original;
        return transaction.quantity;
      },
    },
    {
      header: "Registrado em",
      accessorKey: "created_at",
      cell: ({ row }) => {
        const input = row.original;
        return input.created_at.toLocaleString();
      },
    },
  ];
