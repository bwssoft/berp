"use client";

import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  Button,
  SearchContactHistoricalAccountForm,
} from "../../../../../component";
import { useSearchContactHistoricalModal } from "./use-search-contact.historical.form";

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
  } = useSearchContactHistoricalModal(accountId ?? "");

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
            <SearchContactHistoricalAccountForm
              isLoading={isLoading}
              closeModal={closeModal}
              contacts={contactsByCompany ?? []}
              accountData={accountData}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
