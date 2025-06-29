"use client";

import { deleteOneAddress } from "@/app/lib/@backend/action";
import { toast } from "@/app/lib/@frontend/hook";
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
                title: "Sucesso",
                description: "Contato deletado com sucesso",
                variant: "success",
            });
        } catch (err) {
            console.log(err);
            toast({
                title: "Erro",
                description: "Ocorreu um erro ao deletar contato",
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
