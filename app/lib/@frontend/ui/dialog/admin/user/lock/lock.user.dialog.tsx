import * as React from "react";
import { Button, Dialog } from "../../../../component";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  confirm: () => void;
  isLoading: boolean;
  willLock: boolean;
}

export function LockUserDialog({
  open,
  setOpen,
  confirm,
  isLoading,
  willLock,
}: Props) {
  return (
    <Dialog open={open} setOpen={setOpen}>
      <div className="p-4">
        <h2 className="text-lg font-semibold">
          {willLock ? "Bloquear Usuário" : "Desbloquear Usuário"}
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          {willLock
            ? "Você tem certeza que deseja bloquear este usuário? Uma vez bloqueado o usuário não poderá acessar o sistema, não será possível realizar reset de senha e edição de dados."
            : "Você tem certeza de que deseja desbloquear este usuário? Após o desbloqueio o usuário poderá acessar normalmente o sistema sem necessidade de reset de senha."}
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
            {willLock ? "Bloquear" : "Desbloquear"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
