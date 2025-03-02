import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<{
  input_id: string;
  input_name: string;
  quantity: number;
}>[] = [
  {
    header: "Insumo",
    accessorKey: "input",
    cell: ({ row }) => row.original.input_name,
  },
  {
    header: "Quantidade",
    accessorKey: "quantity",
  },
];
