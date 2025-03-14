"use client";

import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/app/lib/util";
import { ISerialPort } from "@/app/lib/@frontend/hook/use-serial-port";

const statuses = {
  fully_identified: "text-green-500 bg-green-800/20",
  partially_identified: "text-yellow-500 bg-yellow-800/20",
  not_identified: "text-rose-500 bg-rose-800/20",
};

const text = {
  fully_identified: "text-green-800",
  partially_identified: "text-yellow-800",
  not_identified: "text-rose-800",
};

export const columns: ColumnDef<{
  equipment: {
    imei?: string;
    et?: string;
    iccid?: string;
  };
  port: ISerialPort;
}>[] = [
  {
    header: "Identificado",
    accessorKey: "inIdentification",
    cell: ({ row }) => {
      const device = row.original;
      const not_identified =
        !device.equipment.imei &&
        !device.equipment.iccid &&
        !device.equipment.et;
      const is_identified =
        device.equipment.imei && device.equipment.iccid && device.equipment.et;
      const status = is_identified
        ? "fully_identified"
        : not_identified
          ? "not_identified"
          : "partially_identified";
      return (
        <div className="flex items-center gap-1">
          <div
            className={cn(statuses[status], "flex-none rounded-full p-1 w-fit")}
          >
            <div className="h-1.5 w-1.5 rounded-full bg-current" />
          </div>
          <div className={cn("hidden font-semibold sm:block", text[status])}>
            {is_identified
              ? "Identificado"
              : not_identified
                ? "Não Identificado"
                : "Parcialmente Identificado"}
          </div>
        </div>
      );
    },
  },
  {
    header: "Imei",
    accessorKey: "imei",
    cell: ({ row }) => {
      const device = row.original;
      return (
        <p title={device.equipment.imei}>{device.equipment.imei ?? "--"}</p>
      );
    },
  },
  {
    header: "Iccid",
    accessorKey: "iccid",
    cell: ({ row }) => {
      const device = row.original;
      return (
        <p title={device.equipment.iccid}>
          {device.equipment.iccid ? device.equipment.iccid : "--"}
        </p>
      );
    },
  },
  {
    header: "Firmware",
    accessorKey: "et",
    cell: ({ row }) => {
      const device = row.original;
      return <p title={device.equipment.et}>{device.equipment.et ?? "--"}</p>;
    },
  },
];
