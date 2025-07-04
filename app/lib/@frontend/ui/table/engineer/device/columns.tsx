import { IDevice, IProduct } from "@/app/lib/@backend/domain";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { toast } from "@/app/lib/@frontend/hook";
import { deleteOneDeviceById } from "@/app/lib/@backend/action/engineer/device.action";

type Row = IDevice & { product: IProduct };

export const columns: ColumnDef<Row>[] = [
  {
    header: "Serial",
    accessorKey: "serial",
  },
  {
    header: "Modelo",
    accessorKey: "product",
    cell: ({ row }) => {
      const device = row.original;
      return device.product?.name;
    },
  },
  {
    header: "Data de criação",
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
            className="text-blue-600 hover:text-blue-900"
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
