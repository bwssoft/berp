"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {IAccount} from "@/app/lib/@backend/domain/commercial/entity/account.definition";
import {IAccountEconomicGroup} from "@/app/lib/@backend/domain/commercial/entity/account.economic-group.definition";
import {IContact} from "@/app/lib/@backend/domain/commercial/entity/contact.definition";
import { findManyAccount } from "@/app/lib/@backend/action/commercial/account.action";
import { findManyContact } from "@/app/lib/@backend/action/commercial/contact.action";

const clean = (v?: string) => (v ?? "").replace(/\D/g, "");

export function useSearchContactModal(
  economicGroup?: IAccountEconomicGroup,
  holdingTaxId?: string,
) {
  const [open, setOpen] = useState(false);

  const { data: queryResult, isLoading: accountLoading } = useQuery({
    queryKey: [
      "findAccountsByHoldingTaxId",
      clean(economicGroup?.economic_group_holding?.taxId),
      clean(holdingTaxId),
      "only-controlled-v1",
    ],
    enabled: !!economicGroup && !!holdingTaxId,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      if (!economicGroup || !holdingTaxId) {
        return { docs: [], contactsByCompany: [] as { name: string; documentValue: string; contacts: IContact[] }[] };
      }

      const holdingCnpj = clean(holdingTaxId);

      // 1) Todas as contas do grupo
      const accountsByEconomicGroup = await findManyAccount({ economicGroupId: economicGroup.id });

      // 2) Filtros: remover CONTA ATUAL
      const controlledAccounts: IAccount[] = accountsByEconomicGroup.docs.filter((acc) => {
        const accCnpj = clean(acc.document?.value);
        const isHolding = accCnpj === holdingCnpj;
        return !isHolding;
      });

      if (controlledAccounts.length === 0) {
        return { docs: [], contactsByCompany: [] };
      }

      // 3) Buscar contatos só das controladas filtradas
      const contacts: IContact[] = await findManyContact({
        accountId: { $in: controlledAccounts.map((a) => a.id) },
      });

      // 4) Montar apenas empresas que têm contato
      const companiesWithContacts =
        controlledAccounts
          .map((account) => {
            const accountContacts = contacts.filter((c) => c.accountId === account.id);
            if (accountContacts.length === 0) return null;
            return {
              name: account.social_name || account.fantasy_name || "Empresa sem nome",
              documentValue: account.document?.value || "",
              contacts: accountContacts,
            };
          })
          .filter(Boolean) as { name: string; documentValue: string; contacts: IContact[] }[];

      return { docs: controlledAccounts, contactsByCompany: companiesWithContacts };
    },
  });

  const contactsByCompany = (queryResult as any)?.contactsByCompany || [];

  return {
    open,
    openModal: () => setOpen(true),
    closeModal: () => setOpen(false),
    contactsByCompany,
    isLoading: accountLoading,
  };
}
