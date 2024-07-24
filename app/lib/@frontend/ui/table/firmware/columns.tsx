import { deleteOneFirmwareById } from "@/app/lib/@backend/action/firmware.action";
import { IFirmware } from "@/app/lib/@backend/domain";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { toast } from "../../../hook";

export const columns: ColumnDef<IFirmware>[] = [
  {
    header: "Nome",
    accessorKey: "name",
  },
  {
    header: "Versão",
    accessorKey: "version",
  },
  {
    header: "Criado em",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const firmware = row.original;
      return firmware.created_at.toLocaleString();
    },
  },
  {
    header: "",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const firmware = row.original;
      return (
        <td className="flex gap-2 relative whitespace-nowrap pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
          <Link
            href={`/firmware/form/update?id=${firmware.id}`}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Editar
          </Link>
          <form
            action={async () => {
              try {
                await deleteOneFirmwareById({ id: firmware.id! });
                toast({
                  title: "Sucesso!",
                  description: "Firmware deletado com sucesso!",
                  variant: "success",
                });
              } catch (e) {
                toast({
                  title: "Erro!",
                  description: "Falha ao deletar o firmware!",
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