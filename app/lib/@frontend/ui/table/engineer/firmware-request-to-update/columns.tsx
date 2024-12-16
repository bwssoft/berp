import {
  IDevice,
  IFirmware,
  IRequestToUpdate,
} from "@/app/lib/@backend/domain";
import { ColumnDef } from "@tanstack/react-table";

type Type = IRequestToUpdate & {
  device: IDevice;
  firmware: IFirmware;
};
export const columns: ColumnDef<Type>[] = [
  {
    header: "Firmware",
    accessorKey: "firmware",
    cell: ({ row }) => {
      const request_to_update = row.original;
      return request_to_update.firmware.name;
    },
  },
  {
    header: "Serial",
    accessorKey: "device",
    cell: ({ row }) => {
      const request_to_update = row.original;
      return request_to_update.device.serial;
    },
  },
  {
    header: "Criado em",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const request_to_update = row.original;
      return request_to_update.created_at.toLocaleString();
    },
  },
];
