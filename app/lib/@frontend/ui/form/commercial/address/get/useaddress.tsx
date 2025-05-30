import { useEffect, useState } from "react";
import { findManyAddress } from "@/app/lib/@backend/action";
import { IAddress } from "@/app/lib/@backend/domain";

export function useAddresses(accountId: string) {
    const [addresses, setAddresses] = useState<IAddress[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await findManyAddress({ accountId });
                setAddresses(data);
            } catch (err) {
                console.error("Erro ao buscar endereços", err);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [accountId]);

    return { addresses, loading };
}
