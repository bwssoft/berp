"use client";

import {
  findOneAccount,
  updateOneAccount,
} from "@/app/lib/@backend/action/commercial/account.action";
import { createOneContact } from "@/app/lib/@backend/action/commercial/contact.action";
import { IContact } from "@/app/lib/@backend/domain";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { ContactFormSchema } from "@/app/lib/@frontend/ui/form";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useCreateAccountFlow } from "@/app/lib/@frontend/context";

export function useCreateContactModal() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { createContactLocally: createContactInContext } =
    useCreateAccountFlow();

  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  async function createContact(data: ContactFormSchema, accountId?: string) {
    try {
      const { success, error } = await createOneContact({
        ...data,
        cpf: data.cpf ? data.cpf.replace(/[^a-zA-Z0-9]/g, "") : undefined,
        rg: data.rg ? data.rg.replace(/[^a-zA-Z0-9]/g, "") : undefined,
        accountId: accountId ?? undefined,
        contractEnabled: data.contractEnabled ? true : false,
        contactItems:
          data.contactItems?.map((item: any) => ({
            ...item,
            contact:
              item.type[0] === "Email"
                ? item.contact
                : item.contact.replace(/[^0-9]/g, ""),
            type: Array.isArray(item.type) ? item.type[0] : item.type,
            id: item.id ?? crypto.randomUUID(),
          })) || [],
        originType: "api",
      });

      if (success && accountId) {
        const freshAccount = await findOneAccount({ id: accountId });
        const currentContacts: IContact[] = freshAccount?.contacts ?? [];

        const uniqueContacts = new Map<string, IContact>();
        [...currentContacts, success].forEach((c) => {
          if (c?.id) uniqueContacts.set(c.id, c);
        });

        const updatedContacts = Array.from(uniqueContacts.values());

        try {
          await updateOneAccount(
            { id: accountId },
            { contacts: updatedContacts }
          );

          await queryClient.invalidateQueries({
            queryKey: ["findOneAccount", accountId],
          });

          await queryClient.invalidateQueries({
            queryKey: ["findManyAccount", accountId],
          });

          toast({
            title: "Sucesso!",
            description: "Contato criado e conta atualizada com sucesso!",
            variant: "success",
          });

          // reset();
          closeModal();
        } catch (err) {
          console.error(err);
          toast({
            title: "Erro ao atualizar conta!",
            description:
              "O contato foi criado, mas a conta não foi atualizada.",
            variant: "error",
          });
        }
      } else if (error) {
        // Object.entries(error).forEach(([key, msg]) => {
        //  if (key !== "global" && msg) {
        //    setError(key as any, { type: "manual", message: msg as string });
        //  }
        // });

        if (error.global) {
          toast({
            title: "Erro!",
            description: error.global,
            variant: "error",
          });
        }
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Erro",
        description: "Não foi possível criar o contato.",
        variant: "error",
      });
    }
  }

  async function createContactLocally(data: ContactFormSchema) {
    // Create contact in context with proper data transformation
    const contactData = {
      ...data,
      id: crypto.randomUUID(),
      cpf: data.cpf ? data.cpf.replace(/[^a-zA-Z0-9]/g, "") : undefined,
      rg: data.rg ? data.rg.replace(/[^a-zA-Z0-9]/g, "") : undefined,
      contractEnabled: data.contractEnabled ? true : false,
      contactItems:
        data.contactItems?.map((item: any) => ({
          ...item,
          contact:
            item.type[0] === "Email"
              ? item.contact
              : item.contact.replace(/[^0-9]/g, ""),
          type: Array.isArray(item.type) ? item.type[0] : item.type,
          id: item.id ?? crypto.randomUUID(),
        })) || [],
      originType: "local",
    } as IContact;

    createContactInContext(contactData);

    closeModal();
  }

  return {
    open,
    openModal,
    closeModal,
    createContact,
    createContactLocally,
  };
}
