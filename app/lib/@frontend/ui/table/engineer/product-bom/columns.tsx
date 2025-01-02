import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<{
  input: {
    id: string
    name: string
  }
  quantity: number
}>[] = [
    {
      header: "Insumo",
      accessorKey: "input",
      cell: ({ row }) => row.original.input.name
    },
    {
      header: "Quantidade",
      accessorKey: "quantity"
    }
  ];
