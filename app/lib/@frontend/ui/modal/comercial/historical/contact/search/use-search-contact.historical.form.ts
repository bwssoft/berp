"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IAccount, IContact } from "@/app/lib/@backend/domain";
import {
  findManyAccount,
  findOneAccount,
} from "@/app/lib/@backend/action/commercial/account.action";
import { findOneAccountEconomicGroup } from "@/app/lib/@backend/action/commercial/account.economic-group.action";
import { findManyContact } from "@/app/lib/@backend/action/commercial/contact.action";

const PAGE_SIZE = 10;
const currentPage = 1;

export function useSearchContactHistoricalModal(accountId?: string) {
  const [open, setOpen] = useState(false);
  const [accountData, setAccountData] = useState<IAccount | null>();

  const { data: contactsByCompany, isLoading: accountLoading } = useQuery({
    queryKey: ["contactsByCompany", accountId, currentPage],
    queryFn: async () => {
      if (!accountId) return [];

      const account = await findOneAccount({ id: accountId });
      setAccountData(account);

      const empresas: {
        name: string;
        contacts: IContact[];
        documentValue: string;
      }[] = [];

      const documentosInseridos = new Set<string>();

      const addEmpresa = async (empresa: IAccount) => {
        const docValue = empresa.document?.value;
        if (
          docValue &&
          !documentosInseridos.has(docValue) &&
          empresa.fantasy_name &&
          empresa.id
        ) {
          // Fetch contacts for this account
          const accountContacts = await findManyContact({
            accountId: empresa.id,
          });

          if (accountContacts && accountContacts.length > 0) {
            documentosInseridos.add(docValue);
            empresas.push({
              name: empresa.fantasy_name,
              documentValue: docValue,
              contacts: accountContacts,
            });
          }
        }
      };

      if (account) {
        await addEmpresa(account);

        // Check if account has economic group data
        if (account.economicGroupId) {
          try {
            const economicGroupData = await findOneAccountEconomicGroup({
              id: account.economicGroupId,
            });

            if (economicGroupData?.economic_group_holding?.name) {
              const grupo = await findManyAccount(
                {
                  economicGroupId: account.economicGroupId,
                },
                currentPage,
                PAGE_SIZE
              );

              // Process each account in the economic group
              for (const groupAccount of grupo.docs) {
                await addEmpresa(groupAccount);
              }
            }
          } catch (error) {
            console.error("Error fetching economic group data:", error);
          }
        }
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
    contactsByCompany: contactsByCompany ?? [],
    isLoading: accountLoading,
  };
}
