import { Badge } from "@bwsoft/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../../component";
import { IUser } from "@/app/lib/@backend/domain";
import { ClockIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export const columns: ColumnDef<IUser>[] = [
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
  { header: "Perfil", accessorKey: "profile_id" },
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
              alert("Modal com histórico de alterações desse usuario")
            }
            className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <ClockIcon className="size-5" />
          </Button>
          <Link href={`/admin/user/form/update?id=${original.id}`}>
            <Button
              title="Usuários"
              variant="ghost"
              className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <PencilSquareIcon className="size-5" />
            </Button>
          </Link>
        </td>
      );
    },
  },
];
