"use client";

import {
  CreateContactAccountForm,
  Modal,
  ModalBody,
  ModalContent,
} from "@/app/lib/@frontend/ui/component";
import React from "react";

interface Props {
  open: boolean;
  closeModal: () => void;
}

export function CreateContactModal({ open, closeModal }: Props) {
  return (
    <Modal
      open={open}
      onClose={closeModal}
      title="Novo Contato"
      className="bg-white"
      position="center"
    >
      <ModalContent>
        <ModalBody className=" max-h-[80vh]">
          <CreateContactAccountForm closeModal={closeModal} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
