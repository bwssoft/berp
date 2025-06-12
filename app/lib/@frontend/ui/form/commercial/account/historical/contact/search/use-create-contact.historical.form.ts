"use client";

import { updateOneAccount } from "@/app/lib/@backend/action";
import { toast } from "@/app/lib/@frontend/hook";
import { useState, useEffect } from "react";
import { IAccount, IContact } from "@/app/lib/@backend/domain";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  contacts?: {
    name: string;
    contacts: IContact[];
    documentValue: string;
  }[];
  accountData?: IAccount;
  closeModal: () => void;
}

export function useSearchContactHistoricalAccount({
  accountData,
  contacts,
  closeModal,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [contactData, setContactData] = useState<Props["contacts"]>([]);

  useEffect(() => {
    if (contacts && contacts.length > 0) {
      setContactData(contacts);
    }
  }, [contacts]);

  const queryClient = useQueryClient();

  const handleSave = async () => {
    try {
      if (!accountData?.id) return;

      const selectedContacts = contactData
        ?.flatMap((group) => group.contacts)
        .filter((contact) => selectedIds.includes(contact.id));

      const existingContacts: IContact[] = accountData.contacts ?? [];

      const merged = new Map<string, IContact>();

      [...existingContacts, ...(selectedContacts ?? [])].forEach((c) => {
        if (c?.id) merged.set(c.id, c);
      });

      const updatedContacts = Array.from(merged.values());

      await updateOneAccount(
        { id: accountData.id },
        { contacts: updatedContacts }
      );

      await queryClient.invalidateQueries({
        queryKey: ["findOneAccount", accountData.id],
      });

      await queryClient.invalidateQueries({
        queryKey: ["findManyAccount", accountData.id],
      });

      toast({
        title: "Sucesso!",
        variant: "success",
        description: "Contatos atualizados com sucesso!",
      });
      closeModal();
    } catch (error) {
      console.error({ error });
      toast({
        title: "Erro!",
        description: "Não foi possível atualizar os contatos!",
        variant: "error",
      });
    }
  };

  const toggleCheckbox = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id)
    );
  };

  return {
    handleSave,
    toggleCheckbox,
    selectedIds,
    setSelectedIds,
    contactData,
  };
}
