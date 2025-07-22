"use client";

import {
  createOneAddress,
  deleteOneAddress,
} from "@/app/lib/@backend/action/commercial/address.action";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { useState } from "react";
import { addressesQueryKey } from "../../../form/commercial/address/get/useaddress";
import { useQueryClient } from "@tanstack/react-query";

export function useAddressModal() {
  const [open, setOpen] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const queryClient = useQueryClient();

  function openModal() {
    setOpen(true);
  }

  function openModalDeleteCard() {
    setOpenModalDelete(true);
  }
  function closeModal() {
    setOpen(false);
  }

  async function createAddress(data: any, accountId: string) {
    try {
      await createOneAddress({
        ...data,
        accountId,
        zip_code: data.zip_code.replace(/\D/g, ""),
      });
      toast({
        title: "Sucesso!",
        description: "Endereço criado com sucesso!",
        variant: "success",
      });
      // Invalidate and refetch addresses query
      await queryClient.invalidateQueries({
        queryKey: addressesQueryKey(accountId),
      });
      closeModal();
    } catch {
      toast({
        title: "Erro!",
        description: "Falha ao registrar o endereço!",
        variant: "error",
      });
    }
  }

  async function createAddressLocally() {
    // Logic for updating the address can be added here
    // This function can be used to handle the update action
  }

  return {
    open,
    openModal,
    closeModal,
    openModalDelete,
    setOpenModalDelete,
    openModalDeleteCard,
    createAddress,
    createAddressLocally,
  };
}
