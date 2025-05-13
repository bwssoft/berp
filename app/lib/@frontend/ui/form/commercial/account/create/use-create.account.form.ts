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

  contact: z
    .object({
      contractEnabled: z.boolean(),
      name: z.string().min(1, "Nome é obrigatório"),
      positionOrRelation: z.string().min(1, "Cargo ou relação é obrigatório"),
      department: z.string().optional(),

      cpf: z.string().optional(),
      rg: z.string().optional(),

      contactItems: z
        .array(
          z.object({
            type: z.enum([
              "Telefone residencial",
              "Celular",
              "Telefone Comercial",
              "Email",
            ]),
            contact: z
              .array(z.string().min(1, "Contato não pode ser vazio"))
              .min(1, "Adicione ao menos um contato"),
            preferred: z.object({
              phone: z.boolean().optional(),
              whatsapp: z.boolean().optional(),
              email: z.boolean().optional(),
            }),
            contactFor: z
              .array(
                z.enum(["Faturamento", "Marketing", "Suporte", "Comercial"])
              )
              .min(1, "Contato para é obrigatório"),
          })
        )
        .min(1, "Adicione ao menos um tipo de contato"),
    })
    .superRefine((data, ctx) => {
      if (data.contractEnabled) {
        if (!data.cpf) {
          ctx.addIssue({
            code: "custom",
            path: ["cpf"],
            message: "CPF é obrigatório quando contrato está habilitado",
          });
        } else if (!isValidCPF(data.cpf)) {
          ctx.addIssue({
            code: "custom",
            path: ["cpf"],
            message: "Documento inválido!",
          });
        }

        // RG é opcional, mas exibido apenas se contrato habilitado (controle visual no form)
        // Validação obrigatória apenas do CPF conforme sua regra.
      }
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
      contact: {
        contractEnabled: false,
        name: "",
        positionOrRelation: "",
        department: "",
        cpf: "",
        rg: "",
        contactItems: [
          {
            type: "Telefone residencial",
            contact: [],
            preferred: { phone: false, whatsapp: false, email: false },
            contactFor: [],
          },
        ],
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
