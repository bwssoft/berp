"use-client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../../component";
import { IUser } from "@/app/lib/@backend/domain";
import { ClockIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Badge } from "../../../component/badge";

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
        <Badge variant="outline">{original.active ? "Ativo" : "Inativo"}</Badge>
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
      return (
        <div className="flex flex-wrap gap-2 w-64">
          {user.profile.map((profile) => (
            <Badge key={profile.id} variant="outline">
              {profile.name}
            </Badge>
          ))}
        </div>
      )
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
