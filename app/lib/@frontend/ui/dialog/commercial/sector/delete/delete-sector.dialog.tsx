"use client";
import { Button } from '@/frontend/ui/component/button';

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
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4">
            <h2 className="text-lg font-semibold">Excluir setor</h2>

            <p className="mt-2 text-sm text-gray-600">
              Tem certeza que deseja excluir o setor &quot;{sector?.name}&quot;?
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={onClose}
                className="cursor-pointer pointer-events-auto"
              >
                Cancelar
              </Button>
              <Button
                variant="default"
                disabled={isLoading}
                onClick={onDelete}
                className="cursor-pointer pointer-events-auto disabled:cursor-not-allowed"
              >
                {isLoading ? "Excluindo..." : "Confirmar"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
