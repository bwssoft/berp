import * as React from "react";
import { Button, Dialog } from "../../../../component";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  confirm: () => void;
  isLoading: boolean;
}

export function ResetPasswordUserDialog({
  open,
  setOpen,
  confirm,
  isLoading,
}: Props) {
  return (
    <Dialog open={open} setOpen={setOpen}>
      <div className="p-4">
        <h2 className="text-lg font-semibold">Reset de Senha</h2>

        <p className="mt-2 text-sm text-gray-600">
          Você tem certeza que deseja fazer o reset de senha para este usuário?
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
