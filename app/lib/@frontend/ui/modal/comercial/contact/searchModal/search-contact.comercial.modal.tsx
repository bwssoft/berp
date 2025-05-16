"use client";

import React from "react";
import { Modal, ModalBody, ModalContent } from "../../../../component";
import { SearchContactAccountForm } from "../../../../form/commercial/account/contact";
import { IContact } from "@/app/lib/@backend/domain";
import { useSearchContactModal } from "./use-search-contact.comercial.modal";

interface ContactModalProps {
  open: boolean;
  contacts: IContact[];
}

export function SearchContactModal({ open, contacts }: ContactModalProps) {
  const { closeModal } = useSearchContactModal();
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
