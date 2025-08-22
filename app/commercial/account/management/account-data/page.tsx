"use client";

import { restrictFeatureByProfile } from "@/app/lib/@backend/action/auth/restrict.action";
import { findOneAccount } from "@/app/lib/@backend/action/commercial/account.action";
import { findManyAddress } from "@/app/lib/@backend/action/commercial/address.action";
import { findManyContact } from "@/app/lib/@backend/action/commercial/contact.action";
import { findOneAccountEconomicGroup } from "@/app/lib/@backend/action/commercial/account.economic-group.action";
import { AccountDataPage } from "@/app/lib/@frontend/ui/page/commercial/account/data/account.data";
import { useQueries, useQuery } from "@tanstack/react-query";

interface Props {
  searchParams: {
    id: string;
  };
}

export default function Page({ searchParams }: Props) {
  const { id: accountId } = searchParams;

  // Query for account data
  const { data: account, isLoading: isLoadingAccount } = useQuery({
    queryKey: ["findOneAccount", accountId],
    queryFn: () => findOneAccount({ id: accountId }),
    enabled: !!accountId,
    refetchOnMount: true,
  });

  // Query for addresses
  const { data: addresses = [], isLoading: isLoadingAddresses } = useQuery({
    queryKey: ["findManyAddress", accountId],
    queryFn: () => findManyAddress({ accountId }),
    enabled: !!accountId && !!account,
    refetchOnMount: true,
  });

  // Query for contacts
  const { data: contacts = [], isLoading: isLoadingContacts } = useQuery({
    queryKey: ["findManyContact", accountId],
    queryFn: () => findManyContact({ accountId }),
    enabled: !!accountId && !!account,
    refetchOnMount: true,
  });

  // Query for economic group
  const { data: economicGroup, isLoading: isLoadingEconomicGroup } = useQuery({
    queryKey: ["findOneAccountEconomicGroup", account?.economicGroupId],
    queryFn: () => findOneAccountEconomicGroup({ id: account!.economicGroupId! }),
    enabled: !!account && !!account.economicGroupId,
    refetchOnMount: true,
  });

  // Query for permissions using useQueries
  const permissionQueries = useQueries({
    queries: [
      {
        queryKey: [
          "restrictFeatureByProfile",
          "commercial:accounts:access:tab:data:contacts",
        ],
        queryFn: () =>
          restrictFeatureByProfile(
            "commercial:accounts:access:tab:data:contacts"
          ),
        refetchOnMount: true,
      },
      {
        queryKey: [
          "restrictFeatureByProfile",
          "commercial:accounts:access:tab:data:addresses",
        ],
        queryFn: () =>
          restrictFeatureByProfile(
            "commercial:accounts:access:tab:data:addresses"
          ),
        refetchOnMount: true,
      },
      {
        queryKey: [
          "restrictFeatureByProfile",
          "commercial:accounts:access:tab:data:group-edit",
        ],
        queryFn: () =>
          restrictFeatureByProfile(
            "commercial:accounts:access:tab:data:group-edit"
          ),
        refetchOnMount: true,
      },
      {
        queryKey: [
          "restrictFeatureByProfile",
          "commercial:accounts:access:lgpd:full",
        ],
        queryFn: () =>
          restrictFeatureByProfile("commercial:accounts:access:lgpd:full"),
        refetchOnMount: true,
      },
      {
        queryKey: [
          "restrictFeatureByProfile",
          "commercial:accounts:access:lgpd:partial",
        ],
        queryFn: () =>
          restrictFeatureByProfile("commercial:accounts:access:lgpd:partial"),
        refetchOnMount: true,
      },
    ],
  });

  const isLoadingPermissions = permissionQueries.some(
    (query) => query.isLoading
  );

  const permissions = {
    hasPermissionContacts: permissionQueries[0]?.data ?? false,
    hasPermissionAddresses: permissionQueries[1]?.data ?? false,
    hasPermissionEconomicGroup: permissionQueries[2]?.data ?? false,
    fullLgpdAccess: permissionQueries[3]?.data ?? false,
    partialLgpdAccess: permissionQueries[4]?.data ?? false,
  };

  // TODO: ADD SKELETON LOADING FOR DATA
  if (
    isLoadingAccount ||
    isLoadingAddresses ||
    isLoadingContacts ||
    isLoadingEconomicGroup ||
    isLoadingPermissions
  ) {
    return <div className="p-4"></div>;
  }

  // TODO: ADD NOT FOUND PAGE
  if (!account) {
    return <div className="p-4">Conta não encontrada</div>;
  }

  return (
    <AccountDataPage
      addresses={addresses}
      account={account}
      contacts={contacts}
      economicGroup={economicGroup}
      permissions={permissions}
    />
  );
}
