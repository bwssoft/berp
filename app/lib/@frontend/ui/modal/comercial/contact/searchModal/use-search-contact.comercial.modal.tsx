"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IAccount, IContact } from "@/app/lib/@backend/domain";
import { findManyAccount } from "@/app/lib/@backend/action/commercial/account.action";

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

      let groupCompanies: IAccount[] = [];

      if (
        !account?.economic_group_holding?.taxId ||
        account.economic_group_holding.taxId === account.document?.value
      ) {
        const controlleds  = await findManyAccount(
          { "economic_group_holding.taxId": account.document?.value },
          currentPage,
          PAGE_SIZE
        );
        groupCompanies = controlleds.docs;
      } else {
        const holding = await findManyAccount(
          { "document.value": account.economic_group_holding.taxId },
          currentPage,
          PAGE_SIZE
        );
        const otherControlled = await findManyAccount(
          { "economic_group_holding.taxId": account.economic_group_holding.taxId },
          currentPage,
          PAGE_SIZE
        );

        groupCompanies = [...holding.docs, ...otherControlled.docs];
      }

      const newCompanies = groupCompanies
        .filter(
          (empresa) =>
            empresa.document?.value !== account.document?.value &&
            Array.isArray(empresa.contacts) &&
            empresa.contacts.length > 0 &&
            empresa.fantasy_name &&
            empresa.document?.value
        )
        .map((empresa) => ({
          name: empresa.social_name!,
          documentValue: empresa.document.value!,
          contacts: empresa.contacts ?? [],
        }));
        
      const uniqueCompanies = Array.from(
        new Map(newCompanies.map((emp) => [emp.documentValue, emp])).values()
      );

      setContactsByCompany(uniqueCompanies);

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
