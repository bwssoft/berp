"use client";

import React from "react";
import { Modal, ModalBody, ModalContent } from "../../../../component";
import { ContactAccountForm } from "../../../../form/commercial/account/contact";
import { useContactModal } from "./use-contact.comercial.modal";

interface Props {
  open: boolean;
  closeModal: () => void;
}

export function ContactModal({ open, closeModal }: Props) {
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
          <ContactAccountForm closeModal={closeModal} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
