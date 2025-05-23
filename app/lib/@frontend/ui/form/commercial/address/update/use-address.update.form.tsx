"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/app/lib/@frontend/hook";
import { isValidCEP } from "@/app/lib/util/is-valid-cep";
import { useRouter } from "next/navigation";
import { IAddress } from "@/app/lib/@backend/domain";
import { updateOneAddress } from "@/app/lib/@backend/action";

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
        .min(1, "Selecione pelo menos um tipo")
        .optional(),
});

export type AddressFormSchema = z.infer<typeof AddressFormSchema>;

interface Props {
    address: IAddress;
    closeModal: () => void;
}

export function useAddressUpdateForm({ address, closeModal }: Props) {
    const router = useRouter();

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
            zip_code: address.zip_code ?? "",
            street: address.street ?? "",
            number: address.number ?? "",
            complement: address.complement ?? "",
            district: address.district ?? "",
            state: address.state ?? "",
            city: address.city ?? "",
            reference_point: address.reference_point ?? "",
            type: Array.isArray(address.type)
                ? address.type
                : address.type
                  ? [address.type]
                  : [],
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
            try {
                console.log(data);
                await updateOneAddress({ id: address.id }, data);
                toast({
                    title: "Sucesso!",
                    description: "Endereço atualizado com sucesso!",
                    variant: "success",
                });
                closeModal();
                reset();
                router.refresh();
            } catch {
                toast({
                    title: "Erro!",
                    description: "Falha ao atualizar o endereço!",
                    variant: "error",
                });
            }
        },
        () => {}
    );

    return {
        register,
        handleSubmit,
        errors,
        control,
        loadingCep,
    };
}
