"use client";

import React from "react";
import { Modal, ModalBody, ModalContent } from "../../../component";

import { AddressCreateForm } from "../../../form/commercial/address/create/address.create.form";
import { AddressFormSchema } from "../../../form/commercial/address/update";

interface AddressProps {
  open: any;
  closeModal: () => void;
  accountId: string;
  createAddress: (data: AddressFormSchema, accountId: string) => Promise<void>;
}
export function CreatedAddressModal({
  open,
  closeModal,
  accountId,
  createAddress,
}: AddressProps) {
  return (
    <Modal
      open={open}
      onClose={closeModal}
      title="Novo endereço"
      className="bg-white"
      position="center"
    >
      <ModalContent>
        <ModalBody className="min-h-[50vh] max-h-[70vh] w-[70vh]">
          <AddressCreateForm
            onSubmit={createAddress}
            closeModal={closeModal}
            accountId={accountId}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
