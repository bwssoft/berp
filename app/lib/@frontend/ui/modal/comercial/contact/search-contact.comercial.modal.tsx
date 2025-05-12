"use client";

import React from "react";
import {
  ContactAccountForm,
  Modal,
  ModalBody,
  ModalContent,
} from "../../../component";
import { SearchContactAccountForm } from "../../../form/commercial/account/create/search-contact.account.form";

interface ContactModalProps {
  open: boolean;
  closeModal: () => void;
  accountId: string;
}

export function SearchContactModal({
  open,
  closeModal,
  accountId,
}: ContactModalProps) {
  return (
    <Modal
      open={open}
      onClose={closeModal}
      title="Busca de Contatos"
      className="bg-white h-full"
      position="center"
    >
      <ModalContent>
        <ModalBody className="overflow-y-scroll max-h-[70vh]">
          <SearchContactAccountForm accountId={accountId} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
