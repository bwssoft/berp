import { ColumnDef } from "@tanstack/react-table";
import { IAudit } from "@/app/lib/@backend/domain";

const fieldLabel: Record<string, string> = {
  name: "nome",
  email: "e-mail",
  profile: "perfil",
  active: "status",
  external: "Usuário externo",
};

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
    cell: ({ row }) => {
      const { action, metadata, type } = row.original;

      if (type === "create") {
        return action;
      }

      if (type === "update" && metadata && metadata.length > 0) {
        const label = action.split("'")[1] ?? "usuário";

        const camposAlterados = metadata
          .map(({ field, before, after }) => {
            const nomeCampo = fieldLabel[field] ?? field;
            return `campo '${nomeCampo}' de '${before}' para '${after}'`;
          })
          .join("; ");

        return `Usuário '${label}' teve ${camposAlterados} alterado(s)`;
      }

      return action;
    },
  },
];
