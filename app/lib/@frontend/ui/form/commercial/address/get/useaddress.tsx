import { findManyAddress } from "@/backend/action/commercial/address.action";
import { useQuery } from "@tanstack/react-query";

export const addressesQueryKey = (accountId: string) => [
  "addresses",
  accountId,
];

export function useAddresses(accountId: string) {
  const { data: addresses = [], isLoading } = useQuery({
    queryKey: addressesQueryKey(accountId),
    queryFn: async () => {
      try {
        return await findManyAddress({ accountId });
      } catch (err) {
        console.error("Erro ao buscar endereços", err);
        return [];
      }
    },
  });

  return { addresses, loading: isLoading };
}

