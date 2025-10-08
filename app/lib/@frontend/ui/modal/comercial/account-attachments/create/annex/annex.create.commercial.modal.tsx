"use client";

import { CreateAnnexForm } from '@/frontend/ui/form/commercial/account/account-attachments/create/annex/create.annex.form';
import { CreateContactAccountForm } from '@/frontend/ui/form/commercial/account/contact/create/contact.create.account.form';
import { Modal, ModalBody, ModalContent } from '@/frontend/ui/component/modal';

import React from "react";
import { useCreateAnnexModal } from "./use-annex.create.commercial.modal";

interface Props {
  open: boolean;
  closeModal: () => void;
  accountId: string
}

export function CreateAnnexModal({ open, closeModal, accountId }: Props) {
  return (
    <Modal
      open={open}
      onClose={closeModal}
      title="Novo Anexo"
      className="bg-white w-fit max-w-2xl"
      position="center"
    >
      <ModalContent>
        <ModalBody>
          <CreateAnnexForm closeModal={closeModal} accountId={accountId} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
