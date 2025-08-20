"use client";

import {
  LocalAccount,
  LocalContact,
} from "@/app/lib/@frontend/context/create-account-flow.context";
import ContactCard from "@/app/lib/@frontend/ui/card/commercial/account/contact.card";
import StepNavigation from "@/app/lib/@frontend/ui/card/commercial/tab/account-tab";
import { useAccountStepProgress } from "@/app/lib/@frontend/ui/card/commercial/tab/use-account-step-progress";
import { Badge } from "@/app/lib/@frontend/ui/component/badge";
import { Button } from "@/app/lib/@frontend/ui/component/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/lib/@frontend/ui/component/card";
import { FakeLoadingButton } from "@/app/lib/@frontend/ui/component/fake-load-button";
import { DeleteContactDialog } from "@/app/lib/@frontend/ui/dialog/commercial/account/contact/delete/delete.contact.dialog";
import { useDeleteContactDialog } from "@/app/lib/@frontend/ui/dialog/commercial/account/contact/delete/use-delete.contact.dialog";
import { CreateContactModal } from "@/app/lib/@frontend/ui/modal/comercial/contact/contactModal/create/contact.create.commercial.modal";
import { useCreateContactModal } from "@/app/lib/@frontend/ui/modal/comercial/contact/contactModal/create/use-contact.create.commercial.modal";
import { UpdateContactModal } from "@/app/lib/@frontend/ui/modal/comercial/contact/contactModal/update/contact.update.commercial.modal";
import { useUpdateContactModal } from "@/app/lib/@frontend/ui/modal/comercial/contact/contactModal/update/use-contact.update.commercial.modal";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { Phone, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateAccountFlow } from "@/app/lib/@frontend/context/create-account-flow.context";
import { SearchContactModal } from "@/app/lib/@frontend/ui/modal";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  account: LocalAccount;
  contacts: LocalContact[];
  hasPermissionContacts: boolean;
  accountId: string;
}

export function ContactDataPage(props: Props) {
  const { hasPermissionContacts, accountId } = props;

  // Use create account flow context
  const {
    account: localAccount,
    addresses: localAddresses,
    contacts: localContacts,
    economicGroup: localEconomicGroup,
    resetFlow,
    createEntitiesApi,
  } = useCreateAccountFlow();

  const queryClient = useQueryClient();

  // Props are already the local data, so use them directly
  const currentAccount = localAccount;
  const currentContacts = localContacts;

  // Generate steps using the hook
  const steps = useAccountStepProgress({
    accountId: currentAccount?.id || "",
    addresses: localAddresses,
    contacts: currentContacts,
  });

  const [selectedContact, setSelectedContact] = useState<LocalContact>();
  const [isCreatingEntities, setIsCreatingEntities] = useState(false);
  const router = useRouter();

  /**
   * MODAL CRIAÇÃO - CONTATO
   */

  const {
    open: openCreateContact,
    openModal: openModalContact,
    closeModal: closeModalContact,
    createContactLocally,
  } = useCreateContactModal();

  /**
   * MODAL ATUALIZAÇÃO - CONTATO
   */
  const {
    open: openUpdateContact,
    openModal: openUpdateModalContact,
    closeModal: closeUpdateModalContact,
    updateContactLocally,
  } = useUpdateContactModal();

  /**
   * MODAL DELEÇÃO - CONTATO
   */
  const {
    open: openDeleteContact,
    openDialog: openDeleteContactModal,
    setOpen: setOpenDeleteContactModal,
    isLoading: isLoadingDeleteContact,
    deleteContactLocally,
  } = useDeleteContactDialog();

  async function handleCancel() {
    try {
      resetFlow();

      toast({
        title: "Operação cancelada",
        description:
          "O fluxo de criação foi cancelado e você foi redirecionado para a página inicial.",
        variant: "success",
      });

      router.push("/commercial");
    } catch (error) {
      console.error("Error canceling flow:", error);
      toast({
        title: "Erro",
        description: "Erro ao cancelar operação. Tente novamente.",
        variant: "error",
      });
    }
  }

  async function handleFinalizarSalvar() {
    setIsCreatingEntities(true);

    try {
      console.log("Starting createEntitiesApi...");
      const result = await createEntitiesApi();
      console.log("createEntitiesApi result:", result);

      if (result.success && result.accountId) {
        toast({
          title: "Sucesso!",
          description: "Conta e dados relacionados criados com sucesso!",
          variant: "success",
        });

        router.push(
          `/commercial/account/management/account-data?id=${result.accountId}`
        );

        await queryClient.invalidateQueries({
          queryKey: ["findOneAccount", result.accountId],
        });
        await queryClient.invalidateQueries({
          queryKey: ["findManyAddress", result.accountId],
        });
        await queryClient.invalidateQueries({
          queryKey: ["findManyContact", result.accountId],
        });

        await queryClient.invalidateQueries({
          queryKey: ["findOneAccountEconomicGroup"],
        });

        resetFlow();
      } else {
        toast({
          title: "Erro",
          description: result.error || "Erro ao criar entidades",
          variant: "error",
        });
        setIsCreatingEntities(false);
      }
    } catch (error) {
      console.error("Error in handleFinalizarSalvar:", error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao finalizar criação",
        variant: "error",
      });
      setIsCreatingEntities(false);
    }
  }

  return (
    <div>
      {/* Step Navigation */}
      <div className="mb-6">
        <StepNavigation steps={steps} />
      </div>

      <div className="flex gap-4 w-full justify-end"></div>
      <div>
        <Card className="w-full">
          <CardHeader className="pb-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Phone className="h-5 w-5 text-primary" />
                Contatos
                <Badge variant="secondary" className="text-xs">
                  {currentContacts?.length}
                </Badge>
              </CardTitle>
              {hasPermissionContacts && (
                <div className="flex items-center gap-4">
                  {!!localEconomicGroup?.economic_group_holding?.taxId && (
                    <SearchContactModal
                      holdingTaxId={
                        localEconomicGroup.economic_group_holding?.taxId
                      }
                    />
                  )}
                  <Button
                    variant={"ghost"}
                    className="border px-3 py-3"
                    onClick={openModalContact}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {(currentContacts ?? [])?.map((contact, idx) => (
              <ContactCard
                key={contact.id ?? idx}
                contact={contact as any}
                accountId={accountId!}
                onClickEditContactButton={() => {
                  setSelectedContact(contact);
                  openUpdateModalContact();
                }}
                onClickDeleteButton={() => {
                  setSelectedContact(contact);
                  openDeleteContactModal();
                }}
              />
            ))}
          </CardContent>
        </Card>
      </div>
      <footer>
        <div className="flex gap-4 items-end justify-end mt-4">
          <Button onClick={handleCancel} type="button" variant="ghost">
            Cancelar
          </Button>
          <FakeLoadingButton
            controlledLoading={isCreatingEntities}
            onClick={handleFinalizarSalvar}
            disabled={isCreatingEntities}
          >
            {isCreatingEntities ? "Criando..." : "Finalizar e Salvar Conta"}
          </FakeLoadingButton>
        </div>
      </footer>

      <CreateContactModal
        closeModal={closeModalContact}
        open={openCreateContact}
        createContact={createContactLocally}
      />

      <UpdateContactModal
        contact={selectedContact! as any}
        open={openUpdateContact}
        closeModal={closeUpdateModalContact}
        updateContact={updateContactLocally}
      />

      <DeleteContactDialog
        open={openDeleteContact}
        setOpen={setOpenDeleteContactModal}
        confirm={() =>
          selectedContact && deleteContactLocally(selectedContact.id)
        }
        isLoading={isLoadingDeleteContact}
      />
    </div>
  );
}
