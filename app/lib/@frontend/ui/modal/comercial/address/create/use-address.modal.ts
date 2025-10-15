"use client";

import {
  createOneAddress,
  deleteOneAddress,
} from "@/backend/action/commercial/address.action";
import { createOneHistorical } from "@/backend/action/commercial/historical.action";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { useState } from "react";
import { addressesQueryKey } from "../../../../form/commercial/address/get/useaddress";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateAccountFlow } from '@/frontend/context/create-account-flow.context';

import { useAuth } from '@/frontend/context/auth.context';


export function useAddressModal() {
  const [open, setOpen] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();
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
        default_address: false,
      });

      try {
        const addressType = data.type?.join?.(", ") || "comercial";
        await createOneHistorical({
          accountId: accountId,
          title: `Endereço ${addressType} adicionado.`,
          type: "manual",
          author: {
            name: user?.name ?? "",
            avatarUrl: "",
          },
        });
        console.log("Address creation historical entry created successfully");
      } catch (error) {
        console.warn(
          "Failed to create address creation historical entry:",
          error
        );
      }

      toast({
        title: "Sucesso!",
        description: "Endereço criado com sucesso!",
        variant: "success",
      });
      // Invalidate and refetch addresses query
      await queryClient.invalidateQueries({
        queryKey: ["findOneAccount", accountId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["findManyAddress", accountId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["findManyAccount"],
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
    const addressData = {
      ...data,
      id: crypto.randomUUID(),
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

