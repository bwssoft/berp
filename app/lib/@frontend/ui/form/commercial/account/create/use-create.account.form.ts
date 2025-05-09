import { isValidCPF } from "@/app/lib/util/is-valid-cpf";
import { isValidCNPJ } from "@/app/lib/util/is-valid-cnpj";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

const schema = z.object({
  document: z.object({
    value: z.string(),
    type: z.string(),
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
    sector: z.string().min(1),
    economic_group_holding: z.string().optional(),
    economic_group_controlled: z.string().optional(),
  }),
});

export type CreateAccountFormSchema = z.infer<typeof schema>;

export function useCreateAccountForm() {
  const [type, setType] = useState<"cpf" | "cnpj">("cpf");

  const methods = useForm<CreateAccountFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      document: { value: "", type: "cpf" },
      cpf: { name: "", rg: "" },
      cnpj: {
        social_name: "",
        fantasy_name: "",
        state_registration: "",
        municipal_registration: "",
        status: "",
        sector: "",
        economic_group_holding: "",
        economic_group_controlled: "",
      },
    },
  });

  const handleCpfCnpj = (value: string) => {
    const cleanedValue = value.replace(/\D/g, "");

    if (cleanedValue.length === 11) {
      if (isValidCPF(cleanedValue)) {
        methods.setValue("document.type", "cpf", { shouldValidate: true });
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
        methods.setValue("document.type", "cnpj", { shouldValidate: true });
        setType("cnpj");
      } else {
        methods.setError("document.value", {
          type: "manual",
          message: "CNPJ inválido",
        });
      }
    }
  };

  return { methods, handleCpfCnpj, type, setType };
}
