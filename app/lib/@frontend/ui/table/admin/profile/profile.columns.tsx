import { IProfile } from "@/app/lib/@backend/domain";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@bwsoft/badge";
import { ClockIcon, UsersIcon } from "@heroicons/react/24/outline";
import { Button, Toggle } from "../../../component";
import React from "react";

interface Props {
  openActiveDialog: (id: string, value: boolean) => void;
  openUserModal: (profile: Pick<IProfile, "id" | "name">) => void;
}
export const columns = (props: Props): ColumnDef<IProfile>[] => [
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
            onClick={() => props.openUserModal({id: original.id, name: original.name})}
            className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <UsersIcon className="size-5" />
          </Button>
          <button
            onClick={() =>
              props.openActiveDialog(original.id, !original.active)
            }
          >
            <Toggle
              value={original.active}
              disabled={true}
              title={(value) => (value ? "Inativar" : "Ativar")}
              className="pointer-events-none"
            />
          </button>
        </td>
      );
    },
  },
];
