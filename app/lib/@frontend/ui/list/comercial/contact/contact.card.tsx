"use client";

import { WhatsappIcon } from "../../../../svg/whatsapp-icon";
import {
  EnvelopeIcon,
  PhoneIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { PencilSquareIcon } from "@heroicons/react/20/solid";
import { useContactCard } from "./use-contact.card";
import { Button, Dialog } from "../../../component";
import { UpdateContactModal, useUpdateContactModal } from "../../../modal";
import { IContact } from "@/app/lib/@backend/domain";

interface ContactCardProps {
  accountId: string;
}

export function ContactCard({ accountId }: ContactCardProps) {
  const {
    accountData,
    accountLoading,
    deleteContact,
    openModalDelete,
    setOpenModalDelete,
  } = useContactCard(accountId);
  const { closeModal, open, openModal } = useUpdateContactModal();
  if (accountLoading) {
    return <div>Carregando contatos...</div>;
  }

  return (
    <div className="flex flex-col gap-4 w-fit ">
      {accountData?.contacts?.map((contact: IContact) => (
        <div
          key={contact.id}
          className="shadow-md rounded-lg bg-slate-50 p-4 border border-gray-200 text-sm"
        >
          <div className="flex flex-row items-end justify-end w-full gap-1">
            <Button
              variant={"ghost"}
              className="cursor-pointer w-fit"
              onClick={() => setOpenModalDelete(true)}
            >
              <TrashIcon className="w-5 h-5 cursor-pointer" />
            </Button>
            <Button
              onClick={openModal}
              variant={"ghost"}
              className="cursor-pointer w-fit"
            >
              <PencilSquareIcon className="w-5 h-5 cursor-pointer" />
            </Button>
          </div>
          <div className="flex justify-between items-start flex-col w-full -mt-4">
            <span className="font-semibold text-[16px] text-gray-900">
              {contact.name}
            </span>
            <div className="text-xs">
              {contact.contactItems.map((contactItem: any) => (
                <div className="flex gap-2 items-center">
                  <span className="font-semibold">{contactItem.type}: </span>
                  <span
                    title="Preferência de contato"
                    className="text-slate-700"
                  >
                    {contactItem.contact}
                  </span>
                  {contactItem.preferredContact.whatsapp == true && (
                    <WhatsappIcon />
                  )}
                  {contactItem.preferredContact.phone == true && <PhoneIcon />}
                  {contactItem.preferredContact.email == true && (
                    <EnvelopeIcon />
                  )}
                </div>
              ))}
            </div>
            <div className="text-xs">
              <span className="font-semibold">Área: </span>
              <span key={contact.positionOrRelation} className="text-slate-700">
                {contact.positionOrRelation}
              </span>
            </div>
            <div className="text-xs">
              <span className="font-semibold">Contato para: </span>
              {contact.contactFor.map((contactFor: any) => (
                <span
                  key={contactFor}
                  className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-slate-700"
                >
                  {contactFor}
                </span>
              ))}
            </div>
          </div>
          <Dialog
            open={openModalDelete}
            setOpen={() => setOpenModalDelete(true)}
          >
            <div className="p-4">
              <h2 className="text-lg font-semibold">Excluir contato</h2>

              <p className="mt-2 text-sm text-gray-600">
                Tem certeza que deseja excluir esse contato?
              </p>

              <div className="mt-6 flex justify-end gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setOpenModalDelete(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="default"
                  onClick={() => deleteContact(contact.id)}
                >
                  Confirmar
                </Button>
              </div>
            </div>
          </Dialog>
          <UpdateContactModal
            contact={contact}
            open={open}
            closeModal={closeModal}
          />
        </div>
      ))}
    </div>
  );
}
