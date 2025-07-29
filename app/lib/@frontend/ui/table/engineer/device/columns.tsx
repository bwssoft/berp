import { IDevice, IProduct } from "@/app/lib/@backend/domain";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { deleteOneDeviceById } from "@/app/lib/@backend/action/engineer/device.action";

export type Row = IDevice & { product: IProduct };

export const columns: ColumnDef<Row>[] = [
  {
    header: "Serial",
    accessorKey: "serial",
    cell: ({ row }) => {
      const device = row.original;
      return device.equipment.serial;
    },
  },
  {
    header: "Modelo",
    accessorKey: "product",
    cell: ({ row }) => {
      const device = row.original;
      return device.model;
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
            href={`/engineer/device/form/update?id=${device.id}`}
            className="text-blue-600 hover:text-blue-900"
          >
            Editar
          </Link>
        </td>
      );
    },
  },
];
