"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IAccount, IContact } from "@/app/lib/@backend/domain";
import { findManyAccount } from "@/app/lib/@backend/action/commercial/account.action";
import { findOneAccountEconomicGroup } from "@/app/lib/@backend/action/commercial/account.economic-group.action";
import { findManyContact } from "@/app/lib/@backend/action/commercial/contact.action";

export function useSearchContactModal(holdingTaxId?: string) {
  const [open, setOpen] = useState(false);
  const [contactsByCompany, setContactsByCompany] = useState<
    { name: string; contacts: IContact[]; documentValue: string }[]
  >([]);

  const { isLoading: accountLoading } = useQuery({
    queryKey: ["findAccountsByHoldingTaxId", holdingTaxId],
    queryFn: async () => {
      if (!holdingTaxId) return { docs: [], total: 0, pages: 1 };

      // Find economic groups that contain this holding taxId
      const economicGroup = await findOneAccountEconomicGroup({
        "economic_group_holding.taxId": holdingTaxId,
      });

      let groupCompanies: IAccount[] = [];

      if (economicGroup) {
        const accountsByEconomicGroup = await findManyAccount({
          economicGroupId: economicGroup.id,
        });

        const contactsByAccountId = await findManyContact({
          accountId: { $in: accountsByEconomicGroup.docs.map((acc) => acc.id) },
        });

        groupCompanies = accountsByEconomicGroup.docs;

        // Map accounts with their contacts
        const companiesWithContacts = accountsByEconomicGroup.docs
          .map((account) => {
            // Find contacts for this account
            const accountContacts = contactsByAccountId.filter(
              (contact: IContact) => contact.accountId === account.id
            );

            // Only include companies that have contacts
            if (accountContacts.length > 0) {
              return {
                name:
                  account.social_name ||
                  account.fantasy_name ||
                  "Empresa sem nome",
                documentValue: account.document?.value || "",
                contacts: accountContacts,
              };
            }
            return null;
          })
          .filter(Boolean) as {
          name: string;
          contacts: IContact[];
          documentValue: string;
        }[];

        setContactsByCompany(companiesWithContacts);
      }

      return { docs: groupCompanies, total: groupCompanies.length, pages: 1 };
    },
    enabled: !!holdingTaxId,
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
    contactsByCompany,
    isLoading: accountLoading,
  };
}
