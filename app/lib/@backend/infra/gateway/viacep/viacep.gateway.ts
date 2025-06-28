import { singleton } from "@/app/lib/util/singleton";

export interface IViaCepAddress {
    cep: string;
    street: string;
    complement?: string;
    district: string;
    city: string;
    state: string;
    ibge?: string;
    gia?: string;
    ddd?: string;
    siafi?: string;
}

type ViaCepRaw = {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    ibge?: string;
    gia?: string;
    ddd?: string;
    siafi?: string;
    erro?: boolean;
};

class ViaCepGateway {
    private formatCep(cep: string) {
        return cep.replace(/\D/g, "");
    }

    async findByCep(cep: string): Promise<IViaCepAddress> {
        const sanitized = this.formatCep(cep);
        if (sanitized.length !== 8) throw new Error("CEP inválido");
        const res = await fetch(`https://viacep.com.br/ws/${sanitized}/json/`);
        if (!res.ok) throw new Error("Erro ao conectar no ViaCEP");
        const data = (await res.json()) as ViaCepRaw;
        if ("erro" in data) throw new Error("CEP não encontrado");
        return {
            cep: data.cep,
            street: data.logradouro,
            complement: data.complemento || undefined,
            district: data.bairro,
            city: data.localidade,
            state: data.uf,
            ibge: data.ibge,
            gia: data.gia,
            ddd: data.ddd,
            siafi: data.siafi,
        };
    }
}

export const viaCepGateway = singleton(ViaCepGateway);
