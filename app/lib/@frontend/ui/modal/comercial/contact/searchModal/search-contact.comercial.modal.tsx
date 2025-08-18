"use client";

import React from "react";
import { Modal, ModalBody, ModalContent, Button } from "../../../../component";
import { SearchContactAccountForm } from "../../../../form/commercial/account/contact";
import { useSearchContactModal } from "./use-search-contact.comercial.modal";

interface ContactModalProps {
  holdingTaxId?: string;
}

export function SearchContactModal({ holdingTaxId }: ContactModalProps) {
  const { closeModal, openModal, open, contactsByCompany, isLoading } =
    useSearchContactModal(holdingTaxId);

  if (!contactsByCompany) return null;

  return (
    <>
      <Button
        variant={"ghost"}
        className="border px-3 py-3"
        onClick={openModal}
      >
        Buscar contato
      </Button>

      <Modal
        open={open}
        onClose={closeModal}
        title="Busca de Contatos"
        className="bg-white"
        position="center"
      >
        <ModalContent>
          <ModalBody className="max-h-[80vh]">
            <SearchContactAccountForm
              isLoading={isLoading}
              closeModal={closeModal}
              contacts={contactsByCompany ?? []}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
