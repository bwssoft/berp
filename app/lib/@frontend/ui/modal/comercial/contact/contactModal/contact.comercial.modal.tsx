"use client";

import React from "react";
import { Modal, ModalBody, ModalContent } from "../../../../component";
import { ContactAccountForm } from "../../../../form/commercial/account/contact";
import { useContactModal } from "./use-contact.comercial.modal";

interface ContactModalProps {
  open: boolean;
}

export function ContactModal({ open }: ContactModalProps) {
  const { closeModal } = useContactModal();
  return (
    <Modal
      open={open}
      onClose={closeModal}
      title="Novo Contato"
      className="bg-white"
      position="center"
    >
      <ModalContent>
        <ModalBody className="overflow-y-scroll max-h-[70vh]">
          <ContactAccountForm />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
