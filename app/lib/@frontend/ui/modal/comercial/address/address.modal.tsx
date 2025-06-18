"use client";

import React from "react";
import { Modal, ModalBody, ModalContent } from "../../../component";

import { AddressCreateForm } from "../../../form/commercial/address/create/address.create.form";

interface AddressProps {
  open: any;
  closeModal: () => void;
  accountId: string;
}
export function AddressModal({ open, closeModal, accountId }: AddressProps) {
  return (
    <Modal
      open={open}
      onClose={closeModal}
      title="Novo endereço"
      className="bg-white"
      position="center"
    >
      <ModalContent>
        <ModalBody className="overflow-y-scroll max-h-[70vh] w-full">
          <AddressCreateForm closeModal={closeModal} accountId={accountId} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
