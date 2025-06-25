"use client";

import {
  CreateAnnexForm,
  CreateAnnexHistoricalForm,
  Modal,
  ModalBody,
  ModalContent,
} from "@/app/lib/@frontend/ui/component";
import React from "react";

interface Props {
  open: boolean;
  closeModal: () => void;
}

export function CreateAnnexHistoricalModal({ open, closeModal }: Props) {
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
          <CreateAnnexHistoricalForm closeModal={closeModal} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
