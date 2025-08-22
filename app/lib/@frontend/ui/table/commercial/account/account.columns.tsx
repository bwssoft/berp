"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IAccount } from "@/app/lib/@backend/domain";
import { Button } from "../../../component";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { formatLgpdCpf } from "@/app/lib/util/format-lgpd-cpf";
import { formatLgpdCnpj } from "@/app/lib/util/format-lgpd-cnpj";

// Extended interface for IAccount with LGPD permissions
interface IAccountWithPermissions extends IAccount {
  _permissions?: {
    fullLgpdAccess?: boolean;
    partialLgpdAccess?: boolean;
  };
}

export const columns: ColumnDef<IAccountWithPermissions>[] = [
  {
    header: "Cliente",
    accessorKey: "name",
    cell: ({ row }) =>
      row.original.document.type === "cpf" ? (
        <span>{row.original.name}</span>
      ) : (
        <span>{row.original.fantasy_name || row.original.social_name}</span>
      ),
  },
  {
    header: "CPF/CNPJ",
    accessorKey: "document",
    cell: ({ row }) => {
      const value = row.original.document.value;
      const isCpf = value.length === 11;
      const permissions = row.original._permissions || {};

      // Use the utility functions for formatting
      if (isCpf) {
        return formatLgpdCpf(value, permissions);
      } else {
        return formatLgpdCnpj(value, permissions);
      }
    },
  },
  {
    header: "Setor",
    accessorKey: "setor",
    cell: ({ row }) =>
      row.original.setor?.length ? row.original.setor.join(", ") : "-",
  },
  // {
  //   header: "Status Faturamento",
  //   accessorKey: "status",
  //   cell: ({ row }) => {
  //     const status = row.original.status ?? "Inativo";
  //     return (
  //       <Badge
  //         variant="basic"
  //         theme={status === "Ativo" ? "green" : "red"}
  //         label={status}
  //       />
  //     );
  //   },
  // },
  // {
  //   header: "Situação Faturamento",
  //   accessorKey: "billing_situation",
  //   cell: ({ row }) => {
  //     const situation = row.original.billing_situation ?? "Adimplente";
  //     const theme =
  //       situation === "Adimplente"
  //         ? "blue"
  //         : situation === "Inadimplente"
  //           ? "yellow"
  //           : "red";

  //     return <Badge variant="basic" theme={theme} label={situation} />;
  //   },
  // },
  // {
  //   header: "Último Faturamento",
  //   accessorKey: "last_billing_date",
  //   cell: ({ row }) => {
  //     const date = row.original.last_billing_date;
  //     return date ? new Date(date).toLocaleDateString("pt-BR") : "-";
  //   },
  // },
  {
    header: "Ação",
    id: "actions",
    cell: ({ row }) => {
      const account = row.original;
      return (
        <Link
          href={`/commercial/account/management/account-data?id=${account.id}`}
        >
          <Button
            title="Acessar conta"
            variant="ghost"
            className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <PencilSquareIcon className="size-5" />
          </Button>
        </Link>
      );
    },
  },
];
