import { useEffect, useState } from "react";
import { IAccount } from "@/app/lib/@backend/domain";
import { findOneAccount } from "@/app/lib/@backend/action/commercial/account.action";

export function useAccount(id: string) {
    const [account, setAccount] = useState<IAccount | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await findOneAccount({ id });
                setAccount(data as IAccount);
            } catch (err) {
                console.error("Erro ao buscar conta", err);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [id]);

    return { account, loading };
}
