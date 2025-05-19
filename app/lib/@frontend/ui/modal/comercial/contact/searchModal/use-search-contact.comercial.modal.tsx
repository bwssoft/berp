"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { findManyAccount, findOneContact } from "@/app/lib/@backend/action";
import { IContact } from "@/app/lib/@backend/domain";

const PAGE_SIZE = 10;
const currentPage = 1;

export function useSearchContactModal(accountId: string) {
  const [open, setOpen] = useState(false);

  const { data: accountPage, isLoading: accountLoading } = useQuery({
    queryKey: ["findManyAccount", accountId, currentPage],
    queryFn: async () => {
      if (!accountId) return { docs: [], total: 0, pages: 1 };
      return await findManyAccount({ id: accountId }, currentPage, PAGE_SIZE);
    },
    enabled: !!accountId,
  });

  const contactIds: string[] =
    accountPage?.docs[0]?.contacts?.map((c: any) => c.id) ?? [];

  const {
    data: contacts = [],
    isLoading: contactsLoading,
    isError: contactsError,
  } = useQuery({
    queryKey: ["contactsById", contactIds],
    queryFn: async () => {
      const results = await Promise.all(
        contactIds.map((id) => findOneContact({ id }))
      );
      return results.filter((c): c is IContact => !!c);
    },
    enabled: contactIds.length > 0,
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
    contacts,
    isLoading: accountLoading || contactsLoading,
    isError: contactsError,
  };
}
