export interface IAddress {
    id: string;
    street: string;
    district: string;
    city: string;
    state: string;
    number: number;
    complement: string;
    reference_point: string;
    type: "Comercial" | "Entrega" | "Faturamento" | "Residencial";
    createdAt: Date;
    updatedAt?: Date;
}
