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

        const sensitiveFields = new Set(["password", "temporary_password"]);

        const formatChange = (field: string, before: string, after: string) => {
        const nomeCampo = fieldLabel[field] ?? field;

        if (sensitiveFields.has(field)) {
            return `campo '${nomeCampo}'`;
        }

        return `campo '${nomeCampo}' de '${before}' para '${after}'`;
        };

        if (type === "update" && metadata && metadata.length > 0) {
        const label = action.split("'")[1] ?? "usuário";

        const camposAlterados = metadata
            .map(({ field, before, after }) => formatChange(field, before, after))
            .join("; ");

            const plural = metadata.length > 1 ? "alterados" : "alterado";

            return `Usuário '${label}' teve ${camposAlterados} ${plural}`;
        }


            return action;
        },
    },
];
