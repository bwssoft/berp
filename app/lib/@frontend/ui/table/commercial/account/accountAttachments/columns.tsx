"use client";

import { IAccountAttachment } from "@/app/lib/@backend/domain";
import { ColumnDef } from "@tanstack/react-table";

import { ActionColumn } from "./action-column";

export const createColumns = (
  onDelete?: (id: string) => Promise<void>,
  canDeleteAttachments: boolean = true
): ColumnDef<IAccountAttachment>[] => [
  {
    header: "Nome",
    accessorKey: "name",
    cell: ({ row }) => {
      const attachment = row.original;
      return <p className="font-semibold">{attachment.name}</p>;
    },
  },
  {
    header: "Usuário",
    accessorKey: "userId",
    cell: ({ row }) => {
      const attachment = row.original;
      return attachment.user.name;
    },
  },
  {
    header: "Data /Hora",
    accessorKey: "createdAt",
    cell: ({ row }) => {
      const attachment = row.original;
      return attachment.createdAt.toLocaleString();
    },
  },
  {
    header: "",
    accessorKey: "id",
    cell: ({ row }) => {
      const attachment = row.original;
      return (
        <ActionColumn
          attachment={attachment}
          onDelete={onDelete}
          canDeleteAttachments={canDeleteAttachments}
        />
      );
    },
  },
];
