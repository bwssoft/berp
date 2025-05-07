"use-client"

import { Badge } from "@bwsoft/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../../component";
import { IUser } from "@/app/lib/@backend/domain";
import { ClockIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface Props {
  openAuditModal: (user: Pick<IUser, "name" | "id">) => void;
  restrictFeatureByProfile: (code: string) => boolean;
}

export const columns = (props: Props): ColumnDef<IUser>[] => [
  { header: "Nome", accessorKey: "name" },
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
    header: "Tipo do usuário",
    accessorKey: "document",
    cell: ({ row }) => {
      const { original } = row;
      return <p>{original.external ? "Externo" : "Interno"}</p>;
    },
  },
  {
    header: "Perfil",
    accessorKey: "profile",
    cell: ({ row }) => {
      const user = row.original;
      return user.profile.map(({ name }) => name).join(", ");
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

      const hideHistory = props.restrictFeatureByProfile("admin:user:view");
      const hideEdit = props.restrictFeatureByProfile("admin:user:update");
      console.log("AAAAAAAAAAAAAAAA:",hideHistory,",", " BBBBBBBBBBBBBBBB:", hideEdit)
      return (
        <td className="flex gap-2 items-center">
          {hideHistory && (
            <Button
              title="Histórico"
              onClick={() =>
                props.openAuditModal({ name: original.name, id: original.id })
              }
              className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <ClockIcon className="size-5" />
            </Button>
          )}

          {hideEdit && (
            <Link href={`/admin/user/form/update?id=${original.id}`}>
              <Button
                title="Editar"
                variant="ghost"
                className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <PencilSquareIcon className="size-5" />
              </Button>
            </Link>
          )}
        </td>
      );
    },
  },
];
