"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { deleteOneContact } from "@/app/lib/@backend/action/commercial/contact.action";
import { createOneHistorical } from "@/app/lib/@backend/action/commercial/historical.action";
import {
  findOneAccount,
  updateOneAccount,
} from "@/app/lib/@backend/action/commercial/account.action";
import { useSearchParams } from "next/navigation";
import { useCreateAccountFlow } from "@/app/lib/@frontend/context";
import { useAuth } from "@/app/lib/@frontend/context/auth.context";

export function useDeleteContactDialog() {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const qc = useQueryClient();
  const searchParams = useSearchParams();
  const accountId = searchParams.get("id");
  const { user } = useAuth();
  const { deleteContactLocally: deleteContactInContext } =
    useCreateAccountFlow();

  async function deleteContact(id: string) {
    setIsLoading(true);

    try {
      // Capture contact info before deletion for historical record
      let contactToDelete = null;
      if (accountId) {
        const freshAccount = await findOneAccount({ id: accountId });
        contactToDelete = freshAccount?.contacts?.find(
          (contact) => contact.id === id
        );
        console.log(
          "Contact delete - found contact to delete:",
          contactToDelete
        );
      }

      if (accountId) {
        try {
          await deleteOneContact({ id });
          const freshAccount = await findOneAccount({ id: accountId });
          if (freshAccount) {
            const updatedContacts =
              freshAccount.contacts?.filter((contact) => contact.id !== id) ||
              [];

            await updateOneAccount(
              { id: accountId },
              { contacts: updatedContacts }
            );
          }
        } catch (error) {
          console.error(
            "Error updating account after contact deletion:",
            error
          );
        }
      }

      await qc.invalidateQueries({ queryKey: ["findOneAccount", accountId] });
      await qc.invalidateQueries({ queryKey: ["findManyContact", accountId] });
      await qc.invalidateQueries({ queryKey: ["findManyAccount"] });

      // Create historical entry for contact deletion
      if (accountId && contactToDelete) {
        try {
          await createOneHistorical({
            accountId: accountId,
            title: `Contato excluído: ${contactToDelete.name}`,
            description: `Contato foi excluído com sucesso.`,
            type: "manual",
            author: {
              name: user?.email || "Sistema",
            },
          });
          console.log("Contact delete historical entry created successfully");
        } catch (error) {
          console.warn(
            "Failed to create contact deletion historical entry:",
            error
          );
        }
      } else {
        console.warn(
          "Contact delete - No accountId or contact info available for historical tracking"
        );
      }

      toast({
        title: "Sucesso!",
        description: "Contato excluído com sucesso!",
        variant: "success",
      });

      setOpen(false);
    } catch (err) {
      console.error(err);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o contato.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteContactLocally(id: string) {
    // Delete contact from context
    deleteContactInContext(id);

    setOpen(false);
  }

  return {
    open,
    setOpen,
    openDialog: () => setOpen(true),
    isLoading,
    deleteContact,
    deleteContactLocally,
  };
}
