export interface IAddress {
    id?: string | undefined;
    street?: string | undefined;
    district?: string | undefined;
    city?: string | undefined;
    zip_code?: string | undefined;
    state?: string | undefined;
    number?: string | undefined;
    complement?: string | undefined;
    reference_point?: string | undefined;
    type?: "Comercial" | "Entrega" | "Faturamento" | "Residencial";
    created_at?: Date;
    updated_at?: Date;
}
