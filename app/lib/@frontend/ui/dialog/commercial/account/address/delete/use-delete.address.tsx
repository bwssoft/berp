"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { deleteOneAddress } from "@/app/lib/@backend/action/commercial/address.action";
import {
  findOneAccount,
  updateOneAccount,
} from "@/app/lib/@backend/action/commercial/account.action";
import { useSearchParams } from "next/navigation";
import { useCreateAccountFlow } from "@/app/lib/@frontend/context";

export function useAddressDeleteDialog() {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const qc = useQueryClient();
  const searchParams = useSearchParams();
  const accountId = searchParams.get("id");
  const { deleteAddressLocally: deleteAddressInContext } =
    useCreateAccountFlow();

  async function deleteAddress(id: string) {
    setIsLoading(true);

    try {
      if (accountId) {
        try {
          await deleteOneAddress({ id });
          const freshAccount = await findOneAccount({ id: accountId });
          if (freshAccount) {
            const updatedAddresses =
              freshAccount.address?.filter(
                (addr: any) => addr && addr.id !== id
              ) || [];

            await updateOneAccount(
              { id: accountId },
              { address: updatedAddresses }
            );
          }
        } catch (error) {
          console.error(
            "Error updating account after address deletion:",
            error
          );
        }
      }

      await qc.invalidateQueries({ queryKey: ["findOneAccount"] });
      await qc.invalidateQueries({ queryKey: ["findManyAccount"] });

      toast({
        title: "Sucesso!",
        description: "Endereço excluído com sucesso!",
        variant: "success",
      });

      setOpen(false);
    } catch (err) {
      console.error(err);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o endereço.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteAddressLocally(id: string) {
    // Delete address from context
    deleteAddressInContext(id);

    setOpen(false);
  }

  return {
    open,
    setOpen,
    openDialog: () => setOpen(true),
    isLoading,
    deleteAddressLocally,
    deleteAddress,
  };
}
