"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { deleteOneContact } from "@/app/lib/@backend/action/commercial/contact.action";
import {
  findOneAccount,
  updateOneAccount,
} from "@/app/lib/@backend/action/commercial/account.action";
import { useSearchParams } from "next/navigation";

export function useDeleteContactDialog() {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const qc = useQueryClient();
  const searchParams = useSearchParams();
  const accountId = searchParams.get("id");

  const confirm = async (id: string) => {
    setIsLoading(true);

    try {
      if (accountId) {
        try {
          await deleteOneContact({ id });
          const freshAccount = await findOneAccount({ id: accountId });
          if (freshAccount) {
            const updatedContacts =
              freshAccount.contacts?.filter((contact) => contact.id !== id) ||
              [];

            await updateOneAccount(
              { id: accountId },
              { contacts: updatedContacts }
            );
          }
        } catch (error) {
          console.error(
            "Error updating account after contact deletion:",
            error
          );
        }
      }

      await qc.invalidateQueries({ queryKey: ["findOneAccount"] });
      await qc.invalidateQueries({ queryKey: ["findManyAccount"] });

      toast({
        title: "Sucesso!",
        description: "Contato excluído com sucesso!",
        variant: "success",
      });

      setOpen(false);
    } catch (err) {
      console.error(err);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o contato.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    open,
    setOpen,
    openDialog: () => setOpen(true),
    confirm,
    isLoading,
  };
}
