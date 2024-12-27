import { IProduct } from "@/app/lib/@backend/domain";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<NonNullable<IProduct["process_execution"]>[number]>[] = [
  {
    header: "Etapas",
    accessorKey: "step"
  }
];
