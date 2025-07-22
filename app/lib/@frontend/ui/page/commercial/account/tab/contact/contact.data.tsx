"use client";

import { IContact } from "@/app/lib/@backend/domain";
import ContactCard from "@/app/lib/@frontend/ui/card/commercial/account/contact.card";
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
import { SearchContactModal } from "@/app/lib/@frontend/ui/modal/comercial/contact/searchModal/search-contact.comercial.modal";
import { deleteManyAddress } from "@/app/lib/@backend/action/commercial/address.action";
import { deleteManyContact } from "@/app/lib/@backend/action/commercial/contact.action";
import { deleteOneAccount } from "@/app/lib/@backend/action/commercial/account.action";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { Phone, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  contacts: IContact[];
  hasPermissionContacts: boolean;
  accountId: string;
}

export function ContactDataPage(props: Props) {
  const { contacts, hasPermissionContacts, accountId } = props;

  const [selectedContact, setSelectedContact] = useState<IContact>();
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
      await deleteManyAddress({ accountId });
      await deleteManyContact({ accountId });
      await deleteOneAccount({ id: accountId });

      toast({
        title: "Operação cancelada",
        description:
          "A conta foi excluída e você foi redirecionado para a página inicial.",
        variant: "success",
      });

      router.push("/commercial");
    } catch (error) {
      console.error("Error canceling and deleting account:", error);
      toast({
        title: "Erro",
        description: "Erro ao cancelar operação. Tente novamente.",
        variant: "error",
      });
    }
  }

  return (
    <div>
      <div className="flex gap-4 w-full justify-end"></div>
      <div>
        <Card className="w-full">
          <CardHeader className="pb-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Phone className="h-5 w-5 text-primary" />
                Contatos
                <Badge variant="secondary" className="text-xs">
                  {contacts?.length}
                </Badge>
              </CardTitle>
              {hasPermissionContacts && (
                <div className="flex items-center gap-4">
                  <SearchContactModal accountId={accountId ?? ""} />
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
            {(contacts ?? [])?.map((contact, idx) => (
              <ContactCard
                key={contact.id ?? idx}
                contact={contact}
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
            controlledLoading={false}
            onClick={async () => {
              await new Promise((resolve) => setTimeout(resolve, 50));

              router.push(
                `/commercial/account/management/account-data?id=${accountId}`
              );
            }}
          >
            Salvar e próximo
          </FakeLoadingButton>
        </div>
      </footer>

      <CreateContactModal
        closeModal={closeModalContact}
        open={openCreateContact}
        createContact={createContactLocally}
      />

      <UpdateContactModal
        contact={selectedContact!}
        open={openUpdateContact}
        closeModal={closeUpdateModalContact}
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
