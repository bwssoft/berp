"use client";

import React from "react";
import { Modal, ModalBody, ModalContent } from '@/frontend/ui/component/modal';
import { Button } from '@/frontend/ui/component/button';

import { SearchContactAccountForm } from "../../../../form/commercial/account/contact";
import { useSearchContactModal } from "./use-search-contact.comercial.modal";
import { IAccountEconomicGroup } from "@/app/lib/@backend/domain/commercial/entity/account.economic-group.definition";

interface ContactModalProps {
  economicGroup?: IAccountEconomicGroup;
  holdingTaxId: string
}

export function SearchContactModal({ economicGroup, holdingTaxId }: ContactModalProps) {
  const { closeModal, openModal, open, contactsByCompany, isLoading } =
    useSearchContactModal(economicGroup, holdingTaxId);

  if (contactsByCompany.length === 0) return null;

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
