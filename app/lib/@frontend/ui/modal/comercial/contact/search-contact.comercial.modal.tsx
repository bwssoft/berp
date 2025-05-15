"use client";

import React from "react";
import { Modal, ModalBody, ModalContent } from "../../../component";
import { SearchContactAccountForm } from "../../../form/commercial/account/contact";
import { IContact } from "@/app/lib/@backend/domain";

interface ContactModalProps {
  open: boolean;
  closeModal: () => void;
  contacts: IContact[];
}

export function SearchContactModal({
  open,
  closeModal,
  contacts,
}: ContactModalProps) {
  return (
    <Modal
      open={open}
      onClose={closeModal}
      title="Busca de Contatos"
      className="bg-white h-full max-h-[70vh]"
      position="center"
    >
      <ModalContent>
        <ModalBody>
          <SearchContactAccountForm contacts={contacts} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
