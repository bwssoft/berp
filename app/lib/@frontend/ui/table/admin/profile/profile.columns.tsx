"use client";
import {IProfile} from "@/backend/domain/admin/entity/profile.definition";
import { ColumnDef } from "@tanstack/react-table";
import { ClockIcon, UsersIcon } from "@heroicons/react/24/outline";
import { Button } from '@/frontend/ui/component/button';
import { Toggle } from '@/frontend/ui/component/toggle';

import React from "react";
import { Badge } from "../../../component/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../../../component/tooltip";

interface Props {
    openActiveDialog: (id: string, value: boolean) => void;
    openUserModal: (profile: Pick<IProfile, "id" | "name">) => void;
    openAuditModal: (profile: Pick<IProfile, "id" | "name">) => void;
    restrictFeatureByProfile: (code: string) => boolean;
}

export const columns = (props: Props): ColumnDef<IProfile>[] => [
    { header: "Perfil", accessorKey: "name" },
    {
        header: "Status",
        accessorKey: "document",
        cell: ({ row }) => {
            const { original } = row;
            return (
                <Badge variant="outline">
                    {original.active ? "Ativo" : "Inativo"}
                </Badge>
            );
        },
    },
    {
        header: "Data de criação",
        accessorKey: "created_at",
        cell: ({ row }) => {
            const iput = row.original;
            return iput.created_at.toLocaleString();
        },
    },
    {
        header: "Ações",
        accessorKey: "created_at",
        cell: ({ row }) => {
            const { original } = row;

            const hideActiveButton = props.restrictFeatureByProfile(
                "admin:profile:inactive"
            );
            const hideViewButton =
                props.restrictFeatureByProfile("admin:profile:view");

            return (
                <td className="flex gap-2 items-center">
                    {hideViewButton && (
                        <>
                            <Button
                                title="Histórico"
                                onClick={() =>
                                    props.openAuditModal({
                                        id: original.id,
                                        name: original.name,
                                    })
                                }
                                className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            >
                                <ClockIcon className="size-5" />
                            </Button>
                            <Button
                                title="Usuários"
                                onClick={() =>
                                    props.openUserModal({
                                        id: original.id,
                                        name: original.name,
                                    })
                                }
                                className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            >
                                <UsersIcon className="size-5" />
                            </Button>
                        </>
                    )}

                    {hideActiveButton && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() =>
                                        props.openActiveDialog(
                                            original.id,
                                            !original.active
                                        )
                                    }
                                >
                                    <Toggle
                                        value={original.active}
                                        disabled={true}
                                        title={(value) =>
                                            value ? "Inativar" : "Ativar"
                                        }
                                        className="pointer-events-none"
                                    />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                {original.active
                                    ? "Inativar perfil"
                                    : "Ativar perfil"}
                            </TooltipContent>
                        </Tooltip>
                    )}
                </td>
            );
        },
    },
];

