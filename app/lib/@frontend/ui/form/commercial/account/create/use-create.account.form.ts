"use client";
import { isValidCPF } from "@/app/lib/util/is-valid-cpf";
import { isValidCNPJ } from "@/app/lib/util/is-valid-cnpj";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { toast } from "@/app/lib/@frontend/hook";

import { IAccount } from "@/app/lib/@backend/domain";
import { createOneAccount } from "@/app/lib/@backend/action/commercial/account.action";
import { useRouter } from "next/navigation";

const schema = z.object({
    document: z.object({
        value: z.string(),
        type: z.enum(["cpf", "cnpj"]),
    }),
    cpf: z.object({
        name: z.string(),
        rg: z.string(),
    }),
    cnpj: z.object({
        social_name: z.string().min(1),
        fantasy_name: z.string().min(1),
        state_registration: z.string().min(1),
        municipal_registration: z.string().optional(),
        status: z.string().min(1),
        sector: z
            .array(z.string().min(1, "Setor vazio não permitido"))
            .optional(),
        economic_group_holding: z.string().optional(),
        economic_group_controlled: z.string().optional(),
    }),

    contact: z.any().optional(),
    address: z.any().optional(),
});

export type CreateAccountFormSchema = z.infer<typeof schema>;

export function useCreateAccountForm() {
    const [type, setType] = useState<"cpf" | "cnpj">("cpf");
    const router = useRouter();

    const methods = useForm<CreateAccountFormSchema>({
        resolver: zodResolver(schema),
        defaultValues: {
            document: { value: "" },
            cpf: { name: "", rg: "" },
            cnpj: {
                social_name: "",
                fantasy_name: "",
                state_registration: "",
                municipal_registration: "",
                status: "",

                economic_group_holding: "",
                economic_group_controlled: "",
            },
        },
    });

    const handleCpfCnpj = (value: string) => {
        const cleanedValue = value.replace(/\D/g, "");

        if (cleanedValue.length === 11) {
            if (isValidCPF(cleanedValue)) {
                methods.setValue("document.type", "cpf", {
                    shouldValidate: true,
                });
                setType("cpf");
            } else {
                methods.setError("document.value", {
                    type: "manual",
                    message: "CPF inválido",
                });
            }
        }

        if (cleanedValue.length >= 14) {
            if (isValidCNPJ(cleanedValue)) {
                methods.setValue("document.type", "cnpj", {
                    shouldValidate: true,
                });
                setType("cnpj");
            } else {
                methods.setError("document.value", {
                    type: "manual",
                    message: "CNPJ inválido",
                });
            }
        }
    };

    const onSubmit = async (data: CreateAccountFormSchema) => {
        try {
            const base: Omit<IAccount, "id" | "created_at" | "updated_at"> = {
                document: data.document,
                ...(type === "cpf"
                    ? {
                          name: data.cpf.name,
                          rg: data.cpf.rg,
                      }
                    : {
                          social_name: data.cnpj.social_name,
                          fantasy_name: data.cnpj.fantasy_name,
                          state_registration: data.cnpj.state_registration,
                          municipal_registration:
                              data.cnpj.municipal_registration,
                          status: data.cnpj.status,
                          economic_group_holding:
                              data.cnpj.economic_group_holding,
                          economic_group_controlled:
                              data.cnpj.economic_group_controlled,
                          ...(data.cnpj.sector
                              ? {
                                    setor: [
                                        {
                                            id: data.cnpj.sector,
                                            name: "",
                                            active: true,
                                            created_at: new Date(),
                                        },
                                    ],
                                }
                              : {}),
                      }),
            };

            await createOneAccount(base);
            methods.reset();
        } catch (error) {
            console.error(error);
        }
    };

    return { methods, handleCpfCnpj, type, setType, onSubmit };
}
