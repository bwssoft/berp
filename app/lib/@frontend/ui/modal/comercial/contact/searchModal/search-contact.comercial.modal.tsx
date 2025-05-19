"use client";

import React from "react";
import { Modal, ModalBody, ModalContent, Button } from "../../../../component";
import { SearchContactAccountForm } from "../../../../form/commercial/account/contact";
import { useSearchContactModal } from "./use-search-contact.comercial.modal";

interface ContactModalProps {
  accountId?: string;
}

export function SearchContactModal({ accountId }: ContactModalProps) {
  const { closeModal, openModal, open, contacts } = useSearchContactModal(
    accountId ?? ""
  );

  if (!contacts) return null;

  return (
    <>
      <Button onClick={openModal}>Buscar contato</Button>

      <Modal
        open={open}
        onClose={closeModal}
        title="Busca de Contatos"
        className="bg-white h-full max-h-[70vh]"
        position="center"
      >
        <ModalContent>
          <ModalBody>
            <SearchContactAccountForm contacts={contacts ?? []} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
