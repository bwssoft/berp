"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IAccount } from "@/app/lib/@backend/domain";
import { Button } from "../../../component";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

// Extended interface for IAccount with LGPD permissions
interface IAccountWithPermissions extends IAccount {
    _permissions?: {
        fullLgpdAccess?: boolean;
        partialLgpdAccess?: boolean;
    };
}

export const columns: ColumnDef<IAccountWithPermissions>[] = [
    {
        header: "Nome fantasia",
        accessorKey: "name",
        cell: ({ row }) => row.original.fantasy_name?.length ? row.original.fantasy_name : "---",
    },
    {
        header: "Razão Social",
        accessorKey: "social_name",
        cell: ({ row }) => row.original.social_name?.length ? row.original.social_name : "---",
    },
    {
        header: "CPF/CNPJ",
        accessorKey: "document",
        cell: ({ row }) => {
            const value = row.original.document.value;
            const isCpf = value.length === 11;

            // Access permissions from the row data
            const permissions = row.original._permissions || {};
            const canViewFullLgpd = permissions.fullLgpdAccess;
            const canViewPartialLgpd = permissions.partialLgpdAccess;

            // For CPF documents
            if (isCpf) {
                if (canViewFullLgpd) {
                    // Format as CPF with full visibility
                    return value.replace(
                        /(\d{3})(\d{3})(\d{3})(\d{2})/,
                        "$1.$2.$3-$4"
                    );
                } else if (canViewPartialLgpd) {
                    // Mask middle digits (format: 052.***.***.77)
                    const firstThree = value.substring(0, 3);
                    const lastTwo = value.substring(9, 11);
                    return `${firstThree}.***.***.${lastTwo}`;
                } else {
                    // No permission - show fully masked
                    return "***.***.***-**";
                }
            }
            // For CNPJ documents
            else {
                if (canViewFullLgpd) {
                    // Format as CNPJ with full visibility
                    return value.replace(
                        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
                        "$1.$2.$3/$4-$5"
                    );
                } else if (canViewPartialLgpd) {
                    // Mask middle digits of CNPJ (format: 12.***.***/****.55)
                    const firstTwo = value.substring(0, 2);
                    const lastTwo = value.substring(12, 14);
                    return `${firstTwo}.***.***/****-${lastTwo}`;
                } else {
                    // No permission - show fully masked CNPJ
                    return "**.***.***/****-**";
                }
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
                        title="Editar"
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
