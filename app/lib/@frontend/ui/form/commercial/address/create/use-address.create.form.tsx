"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const AddressFormSchema = z.object({
    search_address: z.string().optional(),
    cep: z.string().min(8, "CEP obrigatório"),
    street: z.string().min(1, "Logradouro obrigatório"),
    number: z.string().min(1, "Número obrigatório"),
    complement: z.string().optional(),
    district: z.string().min(1, "Bairro obrigatório"),
    state: z.string().min(1, "Estado obrigatório"),
    city: z.string().min(1, "Cidade obrigatória"),
    landmark: z.string().optional(),
    types: z
        .array(z.enum(["commercial", "delivery", "billing", "residential"]))
        .nonempty("Selecione ao menos um tipo"),
});

export type AddressFormSchema = z.infer<typeof AddressFormSchema>;

export function useAddressForm() {
    const [open, setOpen] = useState(false);

    const methods = useForm<AddressFormSchema>({
        resolver: zodResolver(AddressFormSchema),
        defaultValues: {
            search_address: "",
            cep: "",
            street: "",
            number: "",
            complement: "",
            district: "",
            state: "",
            city: "",
            landmark: "",
            types: [],
        },
    });

    return {
        ...methods,
    };
}
