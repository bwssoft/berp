"use client";

import {
  findOneAccount,
  updateOneAccount,
} from "@/app/lib/@backend/action/commercial/account.action";
import { updateOneContact } from "@/app/lib/@backend/action/commercial/contact.action";
import { IContact } from "@/app/lib/@backend/domain";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useUpdateContactModal() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  async function updateContact(
    data: any,
    contact: IContact,
    accountId?: string
  ) {
    try {
      const { success, error } = await updateOneContact(
        { id: contact.id },
        {
          ...data,
          cpf: data.cpf ? data.cpf.replace(/[^a-zA-Z0-9]/g, "") : undefined,
          rg: data.rg ? data.rg.replace(/[^a-zA-Z0-9]/g, "") : undefined,
          accountId: accountId ?? undefined,
          contactItems: data.contactItems.map((item: any) => {
            const contactType = item.type[0];

            return {
              ...item,
              id: item.id ?? crypto.randomUUID(),
              contact:
                contactType === "Email"
                  ? item.contact
                  : item.contact.replace(/[^0-9]/g, ""),
              type: contactType,
            };
          }),
        }
      );
      if (success) {
        if (accountId) {
          const freshAccount = await findOneAccount({ id: accountId });
          const currentContacts: IContact[] = freshAccount?.contacts ?? [];

          const updatedContact = { ...success, id: contact.id };

          const uniqueContacts = new Map<string, IContact>();
          currentContacts.forEach((c) => {
            if (c?.id) {
              if (c.id === contact.id) {
                uniqueContacts.set(c.id, updatedContact);
              } else {
                uniqueContacts.set(c.id, c);
              }
            }
          });

          if (!uniqueContacts.has(contact.id)) {
            uniqueContacts.set(contact.id, updatedContact);
          }

          const updatedContacts = Array.from(uniqueContacts.values());

          await updateOneAccount(
            { id: accountId },
            { contacts: updatedContacts }
          );
        }

        await queryClient.invalidateQueries({
          queryKey: ["findOneAccount", accountId],
        });

        await queryClient.invalidateQueries({
          queryKey: ["findManyAccount", accountId],
        });

        toast({
          title: "Sucesso!",
          description: "Contato atualizado com sucesso!",
          variant: "success",
        });

        closeModal();
      } else if (error) {
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
        description: "Não foi possível atualizar o contato.",
        variant: "error",
      });
    }
  }

  async function updateContactLocally(
    data: any,
    contact: IContact,
    accountId?: string
  ) {
    // Logic for updating a contact can be added here
  }

  return {
    open,
    openModal,
    closeModal,
    updateContact,
    updateContactLocally,
  };
}
