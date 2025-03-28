import { IProfile } from "@/app/lib/@backend/domain";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@bwsoft/badge";
import { ClockIcon, UsersIcon } from "@heroicons/react/24/outline";
import { Button, Toggle } from "../../../component";
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
      return (
        <td className="flex gap-2 items-center">
          <Button
            title="Histórico"
            onClick={() =>
              alert("Modal com histórico de alterações nesse perfil")
            }
            className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <ClockIcon className="size-5" />
          </Button>
          <Button
            title="Usuários"
            onClick={() => alert("Modal com os usuários desse perfil")}
            className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <UsersIcon className="size-5" />
          </Button>
          <Toggle
            value={original.active}
            onChange={() => alert("activeInactiveProfile({id})")}
            title={(value) => (value ? "Inativar" : "Ativar")}
          />
        </td>
      );
    },
  },
];
