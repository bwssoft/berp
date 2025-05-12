export interface IAddress {
    id: string;
    street: string;
    district: string;
    city: string;
    zip_code: string;
    state: string;
    number: string;
    complement: string;
    reference_point: string;
    type: "Comercial" | "Entrega" | "Faturamento" | "Residencial";
    createdAt: Date;
    updatedAt?: Date;
}
