import { ICommand } from "@/app/lib/@backend/domain";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { toast } from "@/app/lib/@frontend/hook";
import { deleteOneCommandById } from "@/app/lib/@backend/action/engineer/command/command.action";

export const columns: ColumnDef<ICommand>[] = [
  {
    header: "Nome",
    accessorKey: "name",
  },
  {
    header: "Dados",
    accessorKey: "data",
  },
  {
    header: "Data de criação",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const command = row.original;
      return command.created_at.toLocaleString();
    },
  },
  {
    header: "",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const command = row.original;
      return (
        <td className="flex gap-2 relative whitespace-nowrap pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
          <Link
            href={`/engineer/command/form/update?id=${command.id}`}
            className="text-blue-600 hover:text-blue-900"
          >
            Editar
          </Link>
          <form
            action={async () => {
              try {
                await deleteOneCommandById({ id: command.id! });
                toast({
                  title: "Sucesso!",
                  description: "Comando deletado com sucesso!",
                  variant: "success",
                });
              } catch (e) {
                toast({
                  title: "Erro!",
                  description: "Falha ao deletar o comando!",
                  variant: "error",
                });
              }
            }}
          >
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
