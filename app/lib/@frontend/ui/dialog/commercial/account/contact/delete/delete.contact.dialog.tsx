import { Button } from "@/app/lib/@frontend/ui/component/button";
import { Dialog } from "@/app/lib/@frontend/ui/component/dialog";
import * as React from "react";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  confirm: () => void;
  isLoading: boolean;
}

export function DeleteContactDialog({
  open,
  setOpen,
  confirm,
  isLoading,
}: Props) {
  return (
    <Dialog open={open} setOpen={setOpen}>
      <div className="p-4">
        <h2 className="text-lg font-semibold">
          Excluir contato
        </h2>

        <p className="mt-2 text-sm text-gray-600">
           Você tem certeza que deseja excluir este contato? Essa ação é irreversível.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button variant="default" onClick={confirm} disabled={isLoading}>
            Confirmar
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
