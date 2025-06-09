// lib/frontend/hook/use-sector-search.ts
"use client";

import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { ISector } from "@/app/lib/@backend/domain";
import { findManySector } from "@/app/lib/@backend/action/commercial/sector.action";

export function useSectorAcccount() {
    const [sectors, setSectors] = useState<ISector[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await findManySector();
                setSectors(res);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return { sectors, loading };
}
