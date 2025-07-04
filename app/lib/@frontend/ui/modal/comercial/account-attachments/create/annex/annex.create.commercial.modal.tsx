"use client";

import {
  CreateAnnexForm,
  CreateContactAccountForm,
  Modal,
  ModalBody,
  ModalContent,
} from "@/app/lib/@frontend/ui/component";
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
