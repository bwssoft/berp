import { deleteOneClientById } from "@/app/lib/@backend/action";
import { IAccountAttachment } from "@/app/lib/@backend/domain";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<IAccountAttachment>[] = [
  {
    header: "Nome",
    accessorKey: "name",
    cell: ({ row }) => {
      const client = row.original;
      return client.name;
    },
  },
  {
    header: "Usuário",
    accessorKey: "userId",
    cell: ({ row }) => {
      const input = row.original;
      return input.userId;
    },
  },
  {
    header: "Arquivo",
    accessorKey: "file",
    cell: ({ row }) => {
      const input = row.original;
      return input.file.name;
    },
  },
  {
    header: "Ações",
    accessorKey: "",
    cell: ({ row }) => {
      const input = row.original;
      return (
        <td className="flex gap-2 relative whitespace-nowrap pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
          <Link href={``} className="text-blue-600 hover:text-blue-900">
            Ícone aq
          </Link>
          <form onSubmit={() => deleteOneClientById({ id: input.id! })}>
            <button
              type="submit"
              className="text-blue-600 hover:text-blue-900 px-0 py-0"
            >
              Deletar
            </button>
          </form>
        </td>
      );
    },
  },
];
