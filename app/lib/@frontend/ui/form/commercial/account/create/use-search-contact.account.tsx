import { useState } from "react";

export function useSearchContactAccount(accountId: string) {
  const [accounts, setAccounts] = useState<any[]>([]);

  return { accounts };
}
