"use client";

import React from "react";
import { Modal, ModalBody, ModalContent } from "../../../component";
import { ContactAccountForm } from "../../../form/commercial/account/contact";

interface ContactModalProps {
  open: boolean;
  closeModal: () => void;
}

export function ContactModal({ open, closeModal }: ContactModalProps) {
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
