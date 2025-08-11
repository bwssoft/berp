"use client";
import { Dialog, Button } from "@/app/lib/@frontend/ui/component";
import { ISector } from "@/app/lib/@backend/domain";

interface SectorDeleteDialogProps {
  sector?: ISector;
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  isLoading?: boolean;
}

export function SectorDeleteDialog({
  sector,
  open,
  onClose,
  onDelete,
  isLoading = false,
}: SectorDeleteDialogProps) {
  return (
    <Dialog open={open} setOpen={onClose}>
      <div className="p-4">
        <h2 className="text-lg font-semibold">Excluir setor</h2>

        <p className="mt-2 text-sm text-gray-600">
          Tem certeza que deseja excluir o setor "{sector?.name}"?
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="default" disabled={isLoading} onClick={onDelete}>
            {isLoading ? "Excluindo..." : "Confirmar"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
