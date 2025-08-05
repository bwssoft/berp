"use client";

import {
  findOneAccount,
  updateOneAccount,
} from "@/app/lib/@backend/action/commercial/account.action";
import { updateOneContact } from "@/app/lib/@backend/action/commercial/contact.action";
import { createOneHistorical } from "@/app/lib/@backend/action/commercial/historical.action";
import { IContact } from "@/app/lib/@backend/domain";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useCreateAccountFlow } from "@/app/lib/@frontend/context";
import { useAuth } from "@/app/lib/@frontend/context";
import { useSearchParams } from "next/navigation";
import { getChangedFields } from "@/app/lib/util/get-changed-fields";

export function useUpdateContactModal() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const accountIdFromUrl = searchParams.get("id");
  const { updateContactLocally: updateContactInContext } =
    useCreateAccountFlow();

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
      const targetAccountId = accountIdFromUrl || accountId;

      // Prepare the new contact data for comparison
      const newContactData = {
        ...data,
        cpf: data.cpf ? data.cpf.replace(/[^a-zA-Z0-9]/g, "") : undefined,
        rg: data.rg ? data.rg.replace(/[^a-zA-Z0-9]/g, "") : undefined,
        accountId: targetAccountId ?? undefined,
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
      };

      // Get the changed fields by comparing old contact with new data
      const editedFields = getChangedFields(contact, newContactData);

      const { success, error } = await updateOneContact(
        { id: contact.id },
        newContactData
      );
      if (success) {
        if (targetAccountId) {
          const freshAccount = await findOneAccount({ id: targetAccountId });
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
            { id: targetAccountId },
            { contacts: updatedContacts }
          );
        }

        await queryClient.invalidateQueries({
          queryKey: ["findOneAccount", targetAccountId],
        });

        await queryClient.invalidateQueries({
          queryKey: ["findManyAccount", targetAccountId],
        });

        // Create historical entry for contact update
        if (targetAccountId) {
          try {
            await createOneHistorical({
              accountId: targetAccountId,
              title: `Contato atualizado: ${success.name || contact.name}`,
              editedFields: editedFields,
              type: "manual",
              author: {
                name: user?.name ?? "",
                avatarUrl: "",
              },
            });
            console.log("Contact update historical entry created successfully");
          } catch (error) {
            console.warn(
              "Failed to create contact update historical entry:",
              error
            );
          }
        } else {
          console.warn(
            "Contact update - No accountId available for historical tracking"
          );
        }

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
    // Use accountId from URL params or from parameter
    const targetAccountId = accountIdFromUrl || accountId;

    // Prepare updated contact data
    const updatedContactData = {
      ...data,
      id: contact.id,
      cpf: data.cpf ? data.cpf.replace(/[^a-zA-Z0-9]/g, "") : undefined,
      rg: data.rg ? data.rg.replace(/[^a-zA-Z0-9]/g, "") : undefined,
      accountId: targetAccountId ?? undefined,
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
    };

    // Update contact in context
    updateContactInContext(contact.id, updatedContactData);

    closeModal();
  }

  return {
    open,
    openModal,
    closeModal,
    updateContact,
    updateContactLocally,
  };
}
