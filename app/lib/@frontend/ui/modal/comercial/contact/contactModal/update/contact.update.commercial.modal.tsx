"use client";

import {
  CreateContactAccountForm,
  Modal,
  ModalBody,
  ModalContent,
} from "@/app/lib/@frontend/ui/component";
import { UpdateContactAccountForm } from "@/app/lib/@frontend/ui/form/commercial/account/contact/update";
import React from "react";

interface Props {
  open: boolean;
  closeModal: () => void;
}

export function UpdateContactModal({ open, closeModal }: Props) {
  return (
    <Modal
      open={open}
      onClose={closeModal}
      title="Novo Contato"
      className="bg-white"
      position="center"
    >
      <ModalContent>
        <ModalBody className="overflow-y-scroll max-h-[70vh]">
          <UpdateContactAccountForm closeModal={closeModal} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
