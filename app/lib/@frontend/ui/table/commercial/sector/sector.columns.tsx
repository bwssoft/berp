import { ColumnDef } from "@tanstack/react-table";
import { Button, Toggle } from "../../../component";
import { ISector } from "@/app/lib/@backend/domain";
import { TrashIcon } from "@heroicons/react/24/outline";

export function sectorColumns(
  onToggle: (sector: ISector) => void,
  onDelete: (sector: ISector) => void
): ColumnDef<ISector>[] {
  return [
    { header: "Setor", accessorKey: "name" },
    {
      header: "Ação",
      accessorKey: "active",
      cell: ({ row }) => {
        const sector = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onToggle(sector)}
            >
              <Toggle
                value={sector.active}
                disabled
                title={(v) => (v ? "Desativar" : "Ativar")}
                className="pointer-events-none"
              />
            </Button>
            {!sector.active && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => onDelete(sector)}
                title="Excluir setor"
              >
                <TrashIcon className="h-5 w-5 text-red-500" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];
}
