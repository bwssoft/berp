"use client";

import React from "react";
import {
  ContactAccountForm,
  Modal,
  ModalBody,
  ModalContent,
} from "../../../component";

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
        <ModalBody>
          <ContactAccountForm />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
