"use client";

import { cn } from "@/app/lib/util";
import { Dialog, DialogTitle } from "@headlessui/react";
import {
  LockClosedIcon,
  LockOpenIcon,
} from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction, useTransition } from "react";
import { lockUser } from "@/app/lib/@backend/action";


interface Props {

  open: boolean;

  setOpen: Dispatch<SetStateAction<boolean>>;
 
  userId: string;

  willLock: boolean;
 
  onSuccess?: () => void;
}

export const LockUserDialog = ({
  open,
  setOpen,
  userId,
  willLock,
  onSuccess,
}: Props) => {
  const [isPending, startTransition] = useTransition();

  if (!open) return null;

  const handleAction = () =>
    startTransition(async () => {
      await lockUser({ id: userId, lock: willLock });
      setOpen(false);
      onSuccess?.();
    });

  return (
    <Dialog open={open} setOpen={setOpen}>
   
      <div>
        <div
          className={cn(
            "mx-auto flex size-12 items-center justify-center rounded-full",
            willLock ? "bg-red-100" : "bg-green-100",
          )}
        >
          {willLock ? (
            <LockClosedIcon className="size-6 text-red-600" />
          ) : (
            <LockOpenIcon className="size-6 text-green-600" />
          )}
        </div>

        <div className="mt-3 text-center sm:mt-5">
          <DialogTitle
            as="h3"
            className="text-base font-semibold text-gray-900"
          >
            {willLock ? "Bloquear usuário" : "Desbloquear usuário"}
          </DialogTitle>

          <div className="mt-2">
            <p className="text-sm text-gray-500">
              {willLock
                ? "Você tem certeza que deseja bloquear este usuário? Uma vez bloqueado o usuário não poderá acessar o sistema, não será possível realizar reset de senha e edição de dados."
                : "Você tem certeza de que deseja desbloquear este usuário? Após o desbloqueio o usuário poderá acessar normalmente o sistema sem necessidade de reset de senha."}
            </p>
          </div>
        </div>
      </div>


      <div className="mt-5 sm:mt-6">
        <button
          type="button"
          disabled={isPending}
          onClick={handleAction}
          className={cn(
            "inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
            willLock
              ? "bg-red-600 hover:bg-red-500 focus-visible:outline-red-600"
              : "bg-green-600 hover:bg-green-500 focus-visible:outline-green-600",
            isPending && "cursor-not-allowed opacity-60",
          )}
        >
          {isPending
            ? "Processando..."
            : willLock
            ? "Bloquear"
            : "Desbloquear"}
        </button>
      </div>
    </Dialog>
  );
};
