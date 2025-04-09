import { IProfile } from "@/app/lib/@backend/domain";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@bwsoft/badge";
import { ProfileAction } from "./profile.action";

export const columns: ColumnDef<IProfile>[] = [
  { header: "Perfil", accessorKey: "name" },
  {
    header: "Status",
    accessorKey: "document",
    cell: ({ row }) => {
      const { original } = row;
      return (
        <Badge
          variant="basic"
          theme={original.active ? "green" : "gray"}
          label={original.active ? "Ativo" : "Inativo"}
        />
      );
    },
  },
  {
    header: "Data de criação",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const iput = row.original;
      return iput.created_at.toLocaleString();
    },
  },
  {
    header: "Ações",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const { original } = row;
      return <ProfileAction profile={original} />;
    },
  },
];
