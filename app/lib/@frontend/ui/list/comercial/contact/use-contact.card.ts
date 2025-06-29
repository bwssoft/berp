import { findOneAccount } from "@/app/lib/@backend/action/commercial/account.action";
import { deleteOneContact } from "@/app/lib/@backend/action/commercial/contact.action";
import { IContact } from "@/app/lib/@backend/domain";
import { toast } from "@/app/lib/@frontend/hook";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const useContactCard = (accountId: string) => {
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [selectedContact, setSelectedContact] = useState<IContact>(
    {} as IContact
  );
  const queryClient = useQueryClient();

  const { data: accountData, isLoading: accountLoading } = useQuery({
    queryKey: ["findOneAccount", accountId],
    queryFn: async () => await findOneAccount({ id: accountId }),
    enabled: !!accountId,
  });

  const deleteContact = async (id: string) => {
    try {
      await deleteOneContact({ id });
      setOpenModalDelete(false);
      toast({
        title: "Sucesso",
        description: "Contato deletado com sucesso",
        variant: "success",
      });
      await queryClient.invalidateQueries({
        queryKey: ["findOneAccount", accountId],
      });

      await queryClient.invalidateQueries({
        queryKey: ["findManyAccount", accountId],
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
    accountData,
    accountLoading,
    deleteContact,
    setOpenModalDelete,
    openModalDelete,
    setSelectedContact,
    selectedContact,
  };
};
