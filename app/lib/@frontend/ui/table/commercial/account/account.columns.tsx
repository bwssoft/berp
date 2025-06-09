"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IAccount } from "@/app/lib/@backend/domain";
import { Button } from "../../../component";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Badge } from "@bwsoft/badge";

export const columns = (): ColumnDef<IAccount>[] => [
    {
        header: "Cliente",
        accessorKey: "name",
        cell: ({ row }) => row.original.fantasy_name ?? "-",
    },
    {
        header: "CPF/CNPJ",
        accessorKey: "document",
        cell: ({ row }) => row.original.document.value,
    },
    {
        header: "Setor",
        accessorKey: "setor",
        cell: ({ row }) =>
            row.original.setor?.length ? row.original.setor.join(", ") : "-",
    },
    {
        header: "Status Faturamento",
        accessorKey: "billing_status",
        cell: ({ row }) => {
            const status = row.original.billing_status ?? "Inativo";
            return (
                <Badge
                    variant="basic"
                    theme={status === "Ativo" ? "green" : "red"}
                    label={status}
                />
            );
        },
    },
    {
        header: "Situação Faturamento",
        accessorKey: "billing_situation",
        cell: ({ row }) => {
            const situation = row.original.billing_situation ?? "Adimplente";
            const theme =
                situation === "Adimplente"
                    ? "blue"
                    : situation === "Inadimplente"
                      ? "yellow"
                      : "red";

            return <Badge variant="basic" theme={theme} label={situation} />;
        },
    },
    {
        header: "Último Faturamento",
        accessorKey: "last_billing_date",
        cell: ({ row }) => {
            const date = row.original.last_billing_date;
            return date ? new Date(date).toLocaleDateString("pt-BR") : "-";
        },
    },
    {
        header: "Ação",
        id: "actions",
        cell: ({ row }) => {
            const account = row.original;
            return (
                <Link href={`/commercial/account/form/update?id=${account.id}`}>
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
