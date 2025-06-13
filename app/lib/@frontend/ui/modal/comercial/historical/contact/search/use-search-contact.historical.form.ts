"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { findManyAccount } from "@/app/lib/@backend/action";
import { IAccount, IContact } from "@/app/lib/@backend/domain";

const PAGE_SIZE = 10;
const currentPage = 1;

export function useSearchContactHistoricalModal(accountId?: string) {
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

      const empresas: {
        name: string;
        contacts: IContact[];
        documentValue: string;
      }[] = [];

      const documentosInseridos = new Set<string>();

      const addEmpresa = (empresa: IAccount) => {
        const docValue = empresa.document?.value;
        if (
          docValue &&
          !documentosInseridos.has(docValue) &&
          empresa.fantasy_name &&
          Array.isArray(empresa.contacts)
        ) {
          documentosInseridos.add(docValue);
          empresas.push({
            name: empresa.fantasy_name,
            documentValue: docValue,
            contacts: empresa.contacts,
          });
        }
      };

      if (account) {
        addEmpresa(account);

        if (account.economic_group_holding) {
          const grupo = await findManyAccount(
            { economic_group_holding: account.economic_group_holding },
            currentPage,
            PAGE_SIZE
          );

          grupo.docs.forEach(addEmpresa);
        }

        setContactsByCompany(empresas);
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
