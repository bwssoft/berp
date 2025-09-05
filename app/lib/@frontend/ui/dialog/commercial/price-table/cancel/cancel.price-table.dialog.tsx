import { Button } from "@/app/lib/@frontend/ui/component/button";
import { Dialog } from "@/app/lib/@frontend/ui/component/dialog";
import { XCircleIcon } from "@heroicons/react/24/outline";
import * as React from "react";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  confirm: () => void;
  isLoading: boolean;
}

export function CancelPriceTableDialog({
  open,
  setOpen,
  confirm,
  isLoading,
}: Props) {
  return (
    <Dialog open={open} setOpen={setOpen}>
      <div className="p-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <XCircleIcon className="h-5 w-5 text-red-500" />
          Cancelar tabela
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          Você tem certeza que deseja cancelar esta tabela de preços? Essa ação
          é irreversível e todos os dados não salvos serão perdidos.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Manter tabela
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={confirm}
            disabled={isLoading}
          >
            Cancelar tabela
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
