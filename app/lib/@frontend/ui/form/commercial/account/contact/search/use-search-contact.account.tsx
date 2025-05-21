"use client";

import { updateOneAccount, findOneContact } from "@/app/lib/@backend/action";
import { toast } from "@/app/lib/@frontend/hook";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { IAccount, IContact } from "@/app/lib/@backend/domain";

interface Props {
  contacts?: {
    name: string;
    contacts: string[];
    documentValue: string;
  }[];
  accountData?: IAccount;
}

export function useSearchContactAccount({ accountData, contacts }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [contactData, setContactData] = useState<
    {
      name: string;
      contacts: IContact[];
      documentValue: string;
    }[]
  >([]);

  const { isLoading: contactLoading } = useQuery({
    queryKey: ["findContactsByIds", contacts],
    queryFn: async () => {
      const mappedContacts = await Promise.all(
        (contacts ?? []).map(
          async ({ name, contacts: contactIds, documentValue }) => {
            const contactResults = await Promise.all(
              contactIds.map((id) =>
                findOneContact({ id: id }).catch(() => null)
              )
            );
            const validContacts = contactResults.filter(
              (c): c is IContact => !!c
            );
            return { name, documentValue, contacts: validContacts };
          }
        )
      );
      setContactData(mappedContacts);
      return mappedContacts;
    },
    enabled: (contacts?.length ?? 0) > 0,
  });

  const handleSave = async () => {
    try {
      if (!accountData?.id) return;
      const selectedContacts = contactData
        .flatMap((group) => group.contacts)
        .filter((contact) => selectedIds.includes(contact.id))
        .map((c) => c.id);
      const newContacts = Array.from(
        new Set([...(accountData?.contacts ?? []), ...selectedContacts])
      );

      await updateOneAccount({ id: accountData.id }, { contacts: newContacts });

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
    contactLoading,
  };
}
