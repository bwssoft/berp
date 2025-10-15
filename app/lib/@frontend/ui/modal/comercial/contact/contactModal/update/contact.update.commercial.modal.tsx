"use client";

import {IContact} from "@/backend/domain/commercial/entity/contact.definition";
import { Modal, ModalBody, ModalContent } from '@/frontend/ui/component/modal';

import { UpdateContactAccountForm } from "@/app/lib/@frontend/ui/form/commercial/account/contact/update";
import React from "react";

interface Props {
  open: boolean;
  closeModal: () => void;
  contact: IContact;
  updateContact: (
    data: any,
    contact: IContact,
    accountId?: string
  ) => Promise<void>;
}

export function UpdateContactModal({
  open,
  closeModal,
  contact,
  updateContact,
}: Props) {
  return (
    <Modal
      open={open}
      onClose={closeModal}
      title="Atualizar Contato"
      className="bg-white"
      position="center"
    >
      <ModalContent>
        <ModalBody className="min-h-[50vh] max-h-[70vh] w-[70vh]">
          <UpdateContactAccountForm
            onSubmit={updateContact}
            contact={contact}
            closeModal={closeModal}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

