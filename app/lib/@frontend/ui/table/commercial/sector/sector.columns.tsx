import { ColumnDef } from "@tanstack/react-table";
import { Button, Toggle } from "../../../component";
import { ISector } from "@/app/lib/@backend/domain";

export function sectorColumns(
    onToggle: (sector: ISector) => void
): ColumnDef<ISector>[] {
    return [
        { header: "Setor", accessorKey: "name" },
        {
            header: "Ação",
            accessorKey: "active",
            cell: ({ row }) => {
                const sector = row.original;
                return (
                    <Button variant={"ghost"} onClick={() => onToggle(sector)}>
                        <Toggle
                            value={sector.active}
                            disabled={true}
                            title={(v) => (v ? "Desativar" : "Ativar")}
                            className="pointer-events-none"
                        />
                    </Button>
                );
            },
        },
    ];
}
