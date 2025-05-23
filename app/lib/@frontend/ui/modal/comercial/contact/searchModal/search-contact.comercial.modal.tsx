"use client";

import React from "react";
import { Modal, ModalBody, ModalContent, Button } from "../../../../component";
import { SearchContactAccountForm } from "../../../../form/commercial/account/contact";
import { useSearchContactModal } from "./use-search-contact.comercial.modal";

interface ContactModalProps {
  accountId?: string;
}

export function SearchContactModal({ accountId }: ContactModalProps) {
  const {
    closeModal,
    openModal,
    open,
    contactsByCompany,
    isLoading,
    accountData,
  } = useSearchContactModal(accountId ?? "");

  if (!contactsByCompany) return null;

  return (
    <>
      {contactsByCompany.length > 0 && (
        <Button onClick={openModal}>Buscar contato</Button>
      )}

      <Modal
        open={open}
        onClose={closeModal}
        title="Busca de Contatos"
        className="bg-white h-full max-h-[70vh]"
        position="center"
      >
        <ModalContent>
          <ModalBody>
            <SearchContactAccountForm
              isLoading={isLoading}
              contacts={contactsByCompany ?? []}
              accountData={accountData}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
