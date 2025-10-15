import type { IDevice } from "@/backend/domain/engineer/entity/device.definition";
import type { IRequestToUpdate } from "@/backend/domain/engineer/entity/request-to-update-firmware.definition";
import type { IFirmware } from "@/backend/domain/engineer/entity/firmware.definition";
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
      return request_to_update.device.equipment.serial;
    },
  },
  {
    header: "Data de criação",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const request_to_update = row.original;
      return request_to_update.created_at.toLocaleString();
    },
  },
];
