import { ColumnDef } from "@tanstack/react-table";
import { Button } from '@/frontend/ui/component/button';

import {IPriceTableService} from "@/app/lib/@backend/domain/commercial/entity/price-table-service.definition";
import { TrashIcon } from "@heroicons/react/24/outline";

export function serviceColumns(
  onDelete: (service: IPriceTableService) => void
): ColumnDef<IPriceTableService>[] {
  return [
    { header: "Serviço", accessorKey: "name" },
    {
      header: "Ação",
      accessorKey: "actions",
      cell: ({ row }) => {
        const service = row.original;
        return (
          <div className="flex items-center justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onDelete(service)}
              title="Excluir serviço"
              className="p-0 h-10 w-10"
            >
              <TrashIcon className="text-red-500" />
            </Button>
          </div>
        );
      },
    },
  ];
}
