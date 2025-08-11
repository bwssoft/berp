"use client";

import {
  CreateContactAccountForm,
  Modal,
  ModalBody,
  ModalContent,
} from "@/app/lib/@frontend/ui/component";
import { ContactFormSchemaWithOrigin } from "@/app/lib/@frontend/ui/form/commercial/account/contact/create/use-contact.create.account";
import React from "react";

interface Props {
  open: boolean;
  closeModal: () => void;
  createContact: (data: ContactFormSchemaWithOrigin, accountId?: string) => Promise<void>;
}

export function CreateContactModal({ open, closeModal, createContact }: Props) {
  return (
    <Modal
      open={open}
      onClose={closeModal}
      title="Novo Contato"
      className="bg-white"
      position="center"
    >
      <ModalContent>
        <ModalBody className="min-h-[50vh] max-h-[70vh] w-[70vh]">
          <CreateContactAccountForm
            onSubmit={createContact}
            closeModal={closeModal}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
