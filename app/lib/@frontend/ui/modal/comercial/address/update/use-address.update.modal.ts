"use client";

import { updateOneAddress } from "@/app/lib/@backend/action/commercial/address.action";
import { IAddress } from "@/app/lib/@backend/domain";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useCreateAccountFlow } from "@/app/lib/@frontend/context";

export function useAddressUpdateModal() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { updateAddressLocally: updateAddressInContext } =
    useCreateAccountFlow();

  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  async function updateAddress(addressId: string, data: IAddress) {
    try {
      await updateOneAddress({ id: addressId }, data);
      toast({
        title: "Sucesso!",
        description: "Endereço atualizado com sucesso!",
        variant: "success",
      });
      await queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });
      closeModal();
    } catch {
      toast({
        title: "Erro!",
        description: "Falha ao atualizar o endereço!",
        variant: "error",
      });
    }
  }

  async function updateAddressLocally(addressId: string, data: IAddress) {
    // Update address in context
    updateAddressInContext(addressId, data);
  }

  return {
    open,
    openModal,
    closeModal,
    updateAddress,
    updateAddressLocally,
  };
}
