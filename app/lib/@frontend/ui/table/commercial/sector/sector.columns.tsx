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
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onToggle(sector)}
              className="p-0"
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
                className="p-0 h-10 w-10"
              >
                <TrashIcon className="text-red-500" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];
}
