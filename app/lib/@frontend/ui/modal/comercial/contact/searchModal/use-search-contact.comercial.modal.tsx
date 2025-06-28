"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { findManyAccount } from "@/app/lib/@backend/action";
import { IAccount, IContact } from "@/app/lib/@backend/domain";

const PAGE_SIZE = 10;
const currentPage = 1;

export function useSearchContactModal(accountId?: string) {
  const [open, setOpen] = useState(false);
  const [contactsByCompany, setContactsByCompany] = useState<
    { name: string; contacts: IContact[]; documentValue: string }[]
  >([]);
  const [accountData, setAccountData] = useState<IAccount>();

  const { isLoading: accountLoading } = useQuery({
    queryKey: ["findManyAccount", accountId, currentPage],
    queryFn: async () => {
      if (!accountId) return { docs: [], total: 0, pages: 1 };

      const data = await findManyAccount(
        { id: accountId },
        currentPage,
        PAGE_SIZE
      );

      const account = data.docs[0];
      setAccountData(account);

      if (
        account?.economic_group_holding &&
        account.economic_group_holding.taxId !== account.document?.value
      ) {
        const dataForCnpj = await findManyAccount(
          { economic_group_holding: account.economic_group_holding },
          currentPage,
          PAGE_SIZE
        );

        const novasEmpresas: {
          name: string;
          contacts: IContact[];
          documentValue: string;
        }[] = [];

        for (const empresa of dataForCnpj.docs) {
          if (
            empresa.document?.value !== account.document?.value &&
            Array.isArray(empresa.contacts) &&
            empresa.contacts.length > 0 &&
            empresa.fantasy_name &&
            empresa.document?.value
          ) {
            novasEmpresas.push({
              name: empresa.fantasy_name,
              documentValue: empresa.document.value,
              contacts: empresa.contacts,
            });
          }
        }

        setContactsByCompany((prev) => {
          const existingDocs = new Set(prev.map((p) => p.documentValue));
          const novosUnicos = novasEmpresas.filter(
            (n) => !existingDocs.has(n.documentValue)
          );
          return [...prev, ...novosUnicos];
        });
      }

      return data;
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
    contactsByCompany,
    isLoading: accountLoading,
  };
}
