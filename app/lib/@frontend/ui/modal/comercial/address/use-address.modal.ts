"use client";

import { deleteOneAddress } from "@/app/lib/@backend/action/commercial/address.action";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { useState } from "react";

export function useAddressModal() {
  const [open, setOpen] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  function openModal() {
    setOpen(true);
  }

  function openModalDeleteCard() {
    setOpenModalDelete(true);
  }
  function closeModal() {
    setOpen(false);
  }

  const deleteAdress = async (id: any) => {
    try {
      await deleteOneAddress({ id });
      setOpenModalDelete(false);
      toast({
        title: "Sucesso!",
        description: "Endereço excluído com sucesso",
        variant: "success",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o endereço.",
        variant: "error",
      });
    }
  };

  return {
    open,
    openModal,
    closeModal,
    openModalDelete,
    setOpenModalDelete,
    deleteAdress,
    openModalDeleteCard,
  };
}
