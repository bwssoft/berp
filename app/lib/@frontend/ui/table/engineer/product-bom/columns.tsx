import { IProduct } from "@/app/lib/@backend/domain";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<NonNullable<IProduct["bom"]>[number]>[] = [
  {
    header: "Insumo",
    accessorKey: "input_id"
  },
  {
    header: "Quantidade",
    accessorKey: "quantity"
  }
];
