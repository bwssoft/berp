import * as React from "react";
import { Button } from '@/frontend/ui/component/button';
import { Dialog } from '@/frontend/ui/component/dialog';


interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  confirm: () => void;
  isLoading: boolean;
  willActivate: boolean;
}

export function ActiveProfileDialog({
  open,
  setOpen,
  confirm,
  isLoading,
  willActivate,
}: Props) {
  return (
    <Dialog open={open} setOpen={setOpen}>
      <div className="p-4">
        <h2 className="text-lg font-semibold">
          {willActivate ? "Ativar Perfil" : "Inativar Perfil"}
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          {willActivate
            ? "Você tem certeza de que deseja ativar este perfil?"
            : "Você tem certeza de que deseja inativar este perfil?"}
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
            {willActivate ? "Ativar" : "Inativar"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
