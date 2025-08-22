"use client";

import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { useState, useEffect } from "react";
import { IContact } from "@/app/lib/@backend/domain";
import { useCreateAccountFlow } from "@/app/lib/@frontend/context/create-account-flow.context";

interface Props {
  contacts?: {
    name: string;
    contacts: IContact[];
    documentValue: string;
  }[];
  closeModal: () => void;
}

export function useSearchContactAccount({ contacts, closeModal }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [contactData, setContactData] = useState<Props["contacts"]>([]);

  // Use the create account flow context to add contacts locally
  const { createContactLocally, contacts: currentContacts } =
    useCreateAccountFlow();

  useEffect(() => {
    if (contacts && contacts.length > 0) {
      setContactData(contacts);
    }
  }, [contacts]);

  const handleSave = async () => {
    try {
      const selectedContacts = contactData
        ?.flatMap((group) => group.contacts)
        .filter((contact) => selectedIds.includes(contact.id));

      if (selectedContacts && selectedContacts.length > 0) {
        // Add each selected contact to the local flow context
        selectedContacts.forEach((contact) => {
          // Check if contact doesn't already exist in current contacts
          const existsLocally = currentContacts?.some(
            (c) => c.id === contact.id
          );
          if (!existsLocally) {
            createContactLocally({
              id: contact.id,
              contractEnabled: contact.contractEnabled,
              name: contact.name,
              positionOrRelation: contact.positionOrRelation,
              department: contact.department,
              cpf: contact.cpf,
              rg: contact.rg,
              originType: contact.originType,
              contactItems: contact.contactItems,
              contactFor: contact.contactFor,
              accountId: contact.accountId,
              taxId: contact.taxId,
            });
          }
        });

        toast({
          title: "Sucesso!",
          variant: "success",
          description: `${selectedContacts.length} contato(s) adicionado(s) com sucesso!`,
        });
      }

      closeModal();
    } catch (error) {
      console.error({ error });
      toast({
        title: "Erro!",
        description: "Não foi possível adicionar os contatos!",
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
