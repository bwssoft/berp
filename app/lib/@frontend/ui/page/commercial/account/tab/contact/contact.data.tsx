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
    } = useCreateContactModal();

    /**
     * MODAL ATUALIZAÇÃO - CONTATO
     */
    const {
        open: openUpdateContact,
        openModal: openUpdateModalContact,
        closeModal: closeUpdateModalContact,
    } = useUpdateContactModal();

    /**
     * MODAL DELEÇÃO - CONTATO
     */
    const {
        open: openDeleteContact,
        openDialog: openDeleteContactModal,
        setOpen: setOpenDeleteContactModal,
        confirm: deleteContact,
        isLoading: isLoadingDeleteContact,
    } = useDeleteContactDialog();

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
                                    <SearchContactModal
                                        accountId={accountId ?? ""}
                                    />
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
                    <Button type="button" variant="ghost">
                        Cancelar
                    </Button>
                    <FakeLoadingButton
                        controlledLoading={false}
                        onClick={async () => {
                            await new Promise((resolve) =>
                                setTimeout(resolve, 50)
                            );

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
                    selectedContact && deleteContact(selectedContact.id)
                }
                isLoading={isLoadingDeleteContact}
            />
        </div>
    );
}
