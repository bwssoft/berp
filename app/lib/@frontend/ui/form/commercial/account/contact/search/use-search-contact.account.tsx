"use client";

import { updateOneAccount } from "@/app/lib/@backend/action";
import { toast } from "@/app/lib/@frontend/hook";
import { useState, useEffect } from "react";
import { IAccount, IContact } from "@/app/lib/@backend/domain";

interface Props {
  contacts?: {
    name: string;
    contacts: IContact[];
    documentValue: string;
  }[];
  accountData?: IAccount;
}

export function useSearchContactAccount({ accountData, contacts }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [contactData, setContactData] = useState<Props["contacts"]>([]);

  useEffect(() => {
    if (contacts && contacts.length > 0) {
      setContactData(contacts);
    }
  }, [contacts]);

  const handleSave = async () => {
    try {
      if (!accountData?.id) return;

      const selectedContacts = contactData
        ?.flatMap((group) => group.contacts)
        .filter((contact) => selectedIds.includes(contact.id));

      await updateOneAccount(
        { id: accountData.id },
        { contacts: selectedContacts }
      );

      toast({
        title: "Sucesso!",
        variant: "success",
        description: "Contatos atualizados com sucesso!",
      });
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
