import { isValidCPF } from "@/app/lib/util/is-valid-cpf";
import { useState } from "react";
import { z } from "zod";

export type ContactList = {
  id?: string;
  type: string;
  contact: string;
  preferredContact: string;
};

const schema = z
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
            .array(z.enum(["Faturamento", "Marketing", "Suporte", "Comercial"]))
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
  });

export function useContactAccount() {
  const [contactData, setContactData] = useState<ContactList[]>([]);

  const handleNewContact = (
    type: string,
    contact: string,
    preferredContact: string
  ) => {
    setContactData((prev) => [
      ...prev,
      {
        type,
        contact,
        preferredContact,
      },
    ]);
  };

  const handlePreferredContact = (
    contact: ContactList,
    preferredContact: string
  ) => {
    setContactData((prev) =>
      prev.map((item) =>
        item.contact === contact.contact ? { ...item, preferredContact } : item
      )
    );
  };
  return {
    contactData,
    setContactData,
    handleNewContact,
    handlePreferredContact,
  };
}
