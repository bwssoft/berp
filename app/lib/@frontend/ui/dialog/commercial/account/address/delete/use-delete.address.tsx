import { useState } from "react";
import { deleteOneAddress } from "@/app/lib/@backend/action/commercial/address.action";
import { toast } from "@/app/lib/@frontend/hook";
export function useAddressDeleteDialog() {
    const [openModalDelete, setOpenModalDelete] = useState(false);

    function openModalDeleteCard() {
        setOpenModalDelete(true);
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
        openModalDelete,
        setOpenModalDelete,
        deleteAdress,
    };
}
