import { Button } from "@/app/lib/@frontend/ui/component/button";
import { Dialog } from "@/app/lib/@frontend/ui/component/dialog";
import * as React from "react";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  confirm: () => void;
  isLoading: boolean;
}

export function InactivatePriceTableDialog({
  open,
  setOpen,
  confirm,
  isLoading,
}: Props) {
  return (
    <Dialog open={open} setOpen={setOpen}>
      <div className="p-4">
        <h2 className="text-lg font-semibold">Inativar tabela</h2>

        <p className="mt-2 text-sm text-gray-600">
          Você tem certeza que deseja inativar esta tabela de preços? A tabela
          ficará indisponível para novos pedidos, mas os pedidos existentes
          continuarão válidos.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={confirm}
            disabled={isLoading}
          >
            Inativar
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
