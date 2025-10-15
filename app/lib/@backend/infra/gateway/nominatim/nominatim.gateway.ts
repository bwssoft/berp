import { singleton } from "@/app/lib/util/singleton";
import { INominatimInterface } from "@/backend/domain/@shared/gateway/nominatim.gateway.interface";

class NominatimGateway {
    private baseUrl = "https://nominatim.openstreetmap.org/search";

    async searchAddress(query: string): Promise<INominatimInterface[]> {
        const url = `${this.baseUrl}?q=${encodeURIComponent(query)}&format=json&addressdetails=1`;

        const res = await fetch(url, {
            headers: {
                "User-Agent": "seu-app-exemplo/1.0 (seu@email.com)",
            },
        });

        if (!res.ok) throw new Error("Erro ao conectar com o Nominatim");

        const data = await res.json();
        return data as INominatimInterface[];
    }
}

export const nominatimGateway = singleton(NominatimGateway);
