import { IDevice } from "@/app/lib/@backend/domain";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { toast } from "../../../hook";
import { deleteOneDeviceById } from "@/app/lib/@backend/action";

export const columns: ColumnDef<IDevice>[] = [
  {
    header: "Serial",
    accessorKey: "serial",
  },
  {
    header: "Modelo",
    accessorKey: "model",
  },
  {
    header: "Criado em",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const device = row.original;
      return device.created_at.toLocaleString();
    },
  },
  {
    header: "",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const device = row.original;
      return (
        <td className="flex gap-2 relative whitespace-nowrap pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
          <Link
            href={`/device/form/update?id=${device.id}`}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Editar
          </Link>
          <form
            action={async () => {
              try {
                await deleteOneDeviceById({ id: device.id! });
                toast({
                  title: "Sucesso!",
                  description: "Equipamento deletado com sucesso!",
                  variant: "success",
                });
              } catch (e) {
                toast({
                  title: "Erro!",
                  description: "Falha ao deletar o equipamento!",
                  variant: "error",
                });
              }
            }}
          >
            <button
              type="submit"
              className="text-indigo-600 hover:text-indigo-900 px-0 py-0"
            >
              Deletar
            </button>
          </form>
        </td>
      );
    },
  },
];
