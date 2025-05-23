import { deleteOneContact, findOneAccount } from "@/app/lib/@backend/action";
import { toast } from "@/app/lib/@frontend/hook";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const useContactCard = (accountId: string) => {
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const { data: accountData, isLoading: accountLoading } = useQuery({
    queryKey: ["findOneAccount", accountId],
    queryFn: async () => await findOneAccount({ id: accountId }),
    enabled: !!accountId,
  });

  //   const { data, isLoading } = useQuery({
  //     queryKey: ["deleteOneContact", accountId],
  //     queryFn: async () => await deleteOneContact({ id: accountId }),
  //     enabled: !!accountId,
  //   });

  const deleteContact = async (id: string) => {
    try {
      await deleteOneContact({ id });
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
    accountData,
    accountLoading,
    deleteContact,
    setOpenModalDelete,
    openModalDelete,
  };
};
