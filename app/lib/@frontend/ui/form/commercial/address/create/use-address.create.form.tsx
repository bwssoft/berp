"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/app/lib/@frontend/hook";
import { createOneAddress } from "@/app/lib/@backend/action";
import { isValidCEP } from "@/app/lib/util/is-valid-cep";
import { useSearchParams } from "next/navigation";

const AddressFormSchema = z.object({
    zip_code: z.string().min(8, "CEP obrigatório").refine(isValidCEP, {
        message: "CEP inválido.",
    }),
    street: z.string().min(1, "Logradouro obrigatório"),
    number: z.string().min(1, "Número obrigatório"),
    complement: z.string().optional(),
    district: z.string().min(1, "Bairro obrigatório"),
    state: z.string().min(1, "Estado obrigatório"),
    city: z.string().min(1, "Cidade obrigatória"),
    reference_point: z.string().optional(),
    type: z
        .array(z.enum(["Comercial", "Entrega", "Faturamento", "Residencial"]))
        .min(1, "Selecione pelo menos um tipo"),
});

export type AddressFormSchema = z.infer<typeof AddressFormSchema>;

export function useAddressForm() {
    const searchParams = useSearchParams();
    const accountId = searchParams.get("id") ?? "";

    const {
        register,
        handleSubmit: hookFormSubmit,
        formState: { errors },
        control,
        setValue,
        reset,
    } = useForm<AddressFormSchema>({
        resolver: zodResolver(AddressFormSchema),
        defaultValues: {
            zip_code: "",
            street: "",
            number: "",
            complement: "",
            district: "",
            state: "",
            city: "",
            reference_point: "",
            type: [],
        },
    });

    const zip = useWatch({ control, name: "zip_code" });
    const [loadingCep, setLoadingCep] = useState(false);

    useEffect(() => {
        const fetchAddress = async (cep: string) => {
            setLoadingCep(true);

            try {
                const res = await fetch(`/api/viacep?cep=${cep}`);
                if (!res.ok) throw new Error("CEP não encontrado");
                const data = await res.json();
                setValue("street", data.street, { shouldValidate: true });
                setValue("district", data.district, { shouldValidate: true });
                setValue("city", data.city, { shouldValidate: true });
                setValue("state", data.state, { shouldValidate: true });
                if (data.complement) setValue("complement", data.complement);
            } catch (e: any) {
                toast({
                    title: "Erro!",
                    description: e.message,
                    variant: "error",
                });
            } finally {
                setLoadingCep(false);
            }
        };
        if (isValidCEP(zip)) fetchAddress(zip);
    }, [zip, setValue]);

    const handleSubmit = hookFormSubmit(
        async (data) => {
            console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", data);
            try {
                await createOneAddress({ ...data, accountId });
                toast({
                    title: "Sucesso!",
                    description: "Endereço criado com sucesso!",
                    variant: "success",
                });
                reset();
            } catch {
                toast({
                    title: "Erro!",
                    description: "Falha ao registrar o endereço!",
                    variant: "error",
                });
            }
        },
        (err) => {
            console.log(err);
        }
    );

    return {
        register,
        handleSubmit,
        errors,
        control,
        loadingCep,
    };
}
