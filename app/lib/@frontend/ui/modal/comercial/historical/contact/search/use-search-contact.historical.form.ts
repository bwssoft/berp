"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IAccount, IContact } from "@/app/lib/@backend/domain";
import {
  findManyAccount,
  findOneAccount,
} from "@/app/lib/@backend/action/commercial/account.action";

const PAGE_SIZE = 10;
const currentPage = 1;

export function useSearchContactHistoricalModal(accountId?: string) {
  const [open, setOpen] = useState(false);
  const [contactsByCompany, setContactsByCompany] = useState<
    { name: string; contacts: IContact[]; documentValue: string }[]
  >([]);
  const [accountData, setAccountData] = useState<IAccount | null>();

  const { isLoading: accountLoading } = useQuery({
    queryKey: ["findManyAccount", accountId, currentPage],
    queryFn: async () => {
      if (!accountId) return { docs: [], total: 0, pages: 1 };

      const account = await findOneAccount({ id: accountId });
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

        if (account.economic_group_holding?.name) {
          const grupo = await findManyAccount(
            {
              economic_group_holding: {
                name: account.economic_group_holding.name,
              },
            },
            currentPage,
            PAGE_SIZE
          );

          grupo.docs.forEach(addEmpresa);
        }

        setContactsByCompany(empresas);
      }

      return empresas;
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
