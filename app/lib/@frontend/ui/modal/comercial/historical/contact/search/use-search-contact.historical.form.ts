"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IAccount, IContact } from "@/app/lib/@backend/domain";
import { findOneAccount } from "@/app/lib/@backend/action/commercial/account.action";
import { findManyContact } from "@/app/lib/@backend/action/commercial/contact.action";
import { ContactListItem } from "./types";

const transformContactToListItem = (contact: IContact): ContactListItem => ({
  contactId: contact.id,
  contactName: contact.name,
  positionOrRelation: contact.positionOrRelation || "",
  department: contact.department || "",
  contactFor: contact.contactFor || [],
  contactItems: contact.contactItems || [],
  originType: contact.originType || "local",
});

const processAccountContacts = async (
  account: IAccount
): Promise<ContactListItem[]> => {
  if (!account.id) {
    return [];
  }

  try {
    const accountContacts = await findManyContact({ accountId: account.id });

    if (!accountContacts?.length) {
      return [];
    }

    return accountContacts.map((contact) =>
      transformContactToListItem(contact)
    );
  } catch (error) {
    console.error(`Error fetching contacts for account ${account.id}:`, error);
    return [];
  }
};

export function useSearchContactHistoricalModal(accountId?: string) {
  const [open, setOpen] = useState(false);
  const [accountData, setAccountData] = useState<IAccount | null>();

  const { data: contactsByCompany, isLoading: accountLoading } = useQuery({
    queryKey: ["contactsByCompany", accountId],
    queryFn: async (): Promise<ContactListItem[]> => {
      if (!accountId) return [];

      try {
        const account = await findOneAccount({ id: accountId });
        if (!account) return [];

        setAccountData(account);

        const mainAccountContacts = await processAccountContacts(account);
        return mainAccountContacts;
      } catch (error) {
        console.error("Error fetching contacts:", error);
        return [];
      }
    },
    enabled: !!accountId,
  });

  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  return {
    open,
    openModal,
    closeModal,
    accountData,
    contactsByCompany: contactsByCompany ?? [],
    isLoading: accountLoading,
  };
}
