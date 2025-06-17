"use client";

import { useCallback, useEffect, useState } from "react";
import { ISector, IAccount } from "@/app/lib/@backend/domain";
import { findManySector } from "@/app/lib/@backend/action/commercial/sector.action";
import { findManyAccount } from "@/app/lib/@backend/action/commercial/account.action";
import { Filter } from "mongodb";

export function useAccountFilter() {
    const [sectors, setSectors] = useState<ISector[]>([]);
    const [accounts, setAccounts] = useState<IAccount[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchSectors = useCallback(async () => {
        const data = await findManySector({});
        setSectors(data);
    }, []);

    const fetchAccounts = useCallback(
        async (formValues: {
            client?: string;
            document?: string;
            sector?: string;
            billingStatus?: string;
            billingSituation?: string;
        }) => {
            setLoading(true);

            const filter: Filter<IAccount> = {};

            if (formValues.client) {
                filter.$or = [
                    { name: { $regex: formValues.client, $options: "i" } },
                    {
                        fantasy_name: {
                            $regex: formValues.client,
                            $options: "i",
                        },
                    },
                ];
            }

            if (formValues.document) {
                filter["document.value"] = formValues.document;
            }

            if (formValues.sector) {
                filter.setor = { $in: [formValues.sector] };
            }

            if (
                formValues.billingStatus &&
                formValues.billingStatus !== "Todos"
            ) {
                filter.billing_status = formValues.billingStatus as
                    | "Ativo"
                    | "Inativo";
            }

            if (
                formValues.billingSituation &&
                formValues.billingSituation !== "Todos"
            ) {
                filter.billing_situation =
                    formValues.billingSituation === "Regular"
                        ? "Adimplente"
                        : "Inadimplente";
            }

            const response = await findManyAccount(filter);
            setAccounts(response.docs);

            setLoading(false);
        },
        []
    );

    useEffect(() => {
        fetchSectors();
    }, [fetchSectors]);

    return {
        sectors,
        accounts,
        loading,
        fetchAccounts,
    };
}
