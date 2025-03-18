"use client";

import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/app/lib/util";

const statuses = {
  progress: "text-gray-500 bg-gray-800/20",
  success: "text-green-500 bg-green-800/20",
  error: "text-rose-500 bg-rose-800/20",
};

const text = {
  progress: "text-gray-800",
  success: "text-green-800",
  error: "text-rose-800",
};
export const columns: ColumnDef<{
  equipment: {
    imei: string;
  };
  current_id?: string;
  is_successful: boolean;
}>[] = [
  {
    header: "Configurado",
    accessorKey: "checked",
    cell: ({ row }) => {
      const device = row.original;
      const status = device.is_successful ? "success" : "error";
      const label = device.is_successful ? "Sucesso" : "Falha";
      return (
        <div className="flex items-center gap-1">
          <div className={cn(statuses[status], "flex-none rounded-full p-1")}>
            <div className="h-1.5 w-1.5 rounded-full bg-current" />
          </div>
          <div className={cn("hidden font-semibold sm:block", text[status])}>
            {label}
          </div>
        </div>
      );
    },
  },
  {
    header: "Atual",
    accessorKey: "current_id",
    cell: ({ row }) => {
      const device = row.original;
      return <p title={device.current_id}>{device.current_id ?? "--"}</p>;
    },
  },
  {
    header: "Anterior",
    accessorKey: "equipment",
    cell: ({ row }) => {
      const device = row.original;
      return (
        <p title={device.equipment.imei}>{device.equipment.imei ?? "--"}</p>
      );
    },
  },
];
