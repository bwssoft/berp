"use client";

import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/app/lib/util";
import { ISerialPort } from "@/app/lib/@frontend/hook/use-serial-port";
import { Device } from "@/app/lib/@backend/domain";

export interface Row {
  equipment: {
    imei?: string | undefined;
    iccid?: string | undefined;
    firmware?: string | undefined;
    serial?: string | undefined;
  };
  status: "fully_identified" | "partially_identified" | "not_identified";
  port: ISerialPort;
}

const statuses = {
  fully_identified: "text-green-500 bg-green-800/20",
  partially_identified: "text-yellow-500 bg-yellow-800/20",
  not_identified: "text-rose-500 bg-rose-800/20",
};

const textColor = {
  fully_identified: "text-green-800",
  partially_identified: "text-yellow-800",
  not_identified: "text-rose-800",
};

const info = {
  fully_identified: "Identificado",
  partially_identified: "Parcialmente Identificado",
  not_identified: "Não Identificado",
};

const commonColumns: ColumnDef<Row>[] = [
  {
    header: "Identificado",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="flex items-center gap-1">
          <div
            className={cn(statuses[status], "flex-none rounded-full p-1 w-fit")}
          >
            <div className="h-1.5 w-1.5 rounded-full bg-current" />
          </div>
          <div
            className={cn("hidden font-semibold sm:block", textColor[status])}
          >
            {info[status]}
          </div>
        </div>
      );
    },
  },
];

// Define colunas específicas por tipo
const columnMap: Partial<Record<Device.Model, ColumnDef<Row>[]>> = {
  DM_E3_PLUS_4G: [
    {
      header: "Serial",
      accessorKey: "serial",
      cell: ({ row }) => (
        <p title={row.original.equipment.serial}>
          {row.original.equipment.serial ?? "--"}
        </p>
      ),
    },
    {
      header: "Imei",
      accessorKey: "imei",
      cell: ({ row }) => (
        <p title={row.original.equipment.imei}>
          {row.original.equipment.imei ?? "--"}
        </p>
      ),
    },
    {
      header: "Iccid",
      accessorKey: "iccid",
      cell: ({ row }) => (
        <p title={row.original.equipment.iccid}>
          {row.original.equipment.iccid ?? "--"}
        </p>
      ),
    },
    {
      header: "Firmware",
      accessorKey: "firmware",
      cell: ({ row }) => (
        <p title={row.original.equipment.firmware}>
          {row.original.equipment.firmware ?? "--"}
        </p>
      ),
    },
  ],
  DM_BWS_NB2: [
    {
      header: "Serial",
      accessorKey: "serial",
      cell: ({ row }) => (
        <p title={row.original.equipment.serial}>
          {row.original.equipment.serial ?? "--"}
        </p>
      ),
    },
    {
      header: "Imei",
      accessorKey: "imei",
      cell: ({ row }) => (
        <p title={row.original.equipment.imei}>
          {row.original.equipment.imei ?? "--"}
        </p>
      ),
    },
    {
      header: "Iccid",
      accessorKey: "iccid",
      cell: ({ row }) => (
        <p title={row.original.equipment.iccid}>
          {row.original.equipment.iccid ?? "--"}
        </p>
      ),
    },
    {
      header: "Firmware",
      accessorKey: "firmware",
      cell: ({ row }) => (
        <p title={row.original.equipment.firmware}>
          {row.original.equipment.firmware ?? "--"}
        </p>
      ),
    },
  ],
  DM_BWS_LORA: [
    {
      header: "Serial",
      accessorKey: "serial",
      cell: ({ row }) => (
        <p title={row.original.equipment.serial}>
          {row.original.equipment.serial ?? "--"}
        </p>
      ),
    },
    {
      header: "Firmware",
      accessorKey: "firmware",
      cell: ({ row }) => (
        <p title={row.original.equipment.firmware}>
          {row.original.equipment.firmware ?? "--"}
        </p>
      ),
    },
  ],
  DM_BWS_NB2_LORA: [
    {
      header: "Serial",
      accessorKey: "serial",
      cell: ({ row }) => (
        <p title={row.original.equipment.serial}>
          {row.original.equipment.serial ?? "--"}
        </p>
      ),
    },
    {
      header: "Imei",
      accessorKey: "imei",
      cell: ({ row }) => (
        <p title={row.original.equipment.imei}>
          {row.original.equipment.imei ?? "--"}
        </p>
      ),
    },
    {
      header: "Iccid",
      accessorKey: "iccid",
      cell: ({ row }) => (
        <p title={row.original.equipment.iccid}>
          {row.original.equipment.iccid ?? "--"}
        </p>
      ),
    },
    {
      header: "Firmware",
      accessorKey: "firmware",
      cell: ({ row }) => (
        <p title={row.original.equipment.firmware}>
          {row.original.equipment.firmware ?? "--"}
        </p>
      ),
    },
  ],
};

export function getColumns(type: Device.Model): ColumnDef<Row>[] {
  return [...commonColumns, ...(columnMap[type] || [])];
}
