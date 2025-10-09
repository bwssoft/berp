import { IDevice } from "@/app/lib/@backend/domain/engineer/entity/device.definition";
import { deviceConstants } from "@/app/lib/constant";
import { ColumnDef } from "@tanstack/react-table";

export type Row = IDevice;

export const columns = (activate: boolean): ColumnDef<Row>[] => [
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
      return deviceConstants.model[device.model];
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
      return <td>{activate ? "Ativar" : "Desativar"}</td>;
    },
  },
];
