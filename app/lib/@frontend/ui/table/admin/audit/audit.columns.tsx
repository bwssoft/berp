import { ColumnDef } from "@tanstack/react-table";
import { IAudit } from "@/app/lib/@backend/domain";


export const columns: ColumnDef<IAudit>[] = [
  {
    header: "Data/Hora",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const data = row.original.created_at;
      return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "medium",
      }).format(data);
    },
  },
  {
    header: "Usuário",
    accessorKey: "user",
    cell: ({ row }) => {
      const { user } = row.original;
      return user?.name ?? "";
    },
  },
  {
    header: "Ação",
    accessorKey: "action",
  },
];
