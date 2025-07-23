"use client";

import {
  createOneAddress,
  deleteOneAddress,
} from "@/app/lib/@backend/action/commercial/address.action";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { useState } from "react";
import { addressesQueryKey } from "../../../form/commercial/address/get/useaddress";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateAccountFlow } from "@/app/lib/@frontend/context";

export function useAddressModal() {
  const [open, setOpen] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const queryClient = useQueryClient();
  const { createAddressLocally: createAddressInContext } =
    useCreateAccountFlow();

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

  async function createAddressLocally(data: any) {
    // Create address in context with proper typing
    const addressData = {
      ...data,
      id: data.id || crypto.randomUUID(),
      zip_code: data.zip_code?.replace(/\D/g, "") || data.zip_code,
    };

    createAddressInContext(addressData);

    closeModal();
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
