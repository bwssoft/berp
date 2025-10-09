"use client";

import React from "react";
import { AddressUpdateForm } from "../../../../form/commercial/address/update";
import { Modal, ModalBody, ModalContent } from '@/frontend/ui/component/modal';

import {IAddress} from "@/backend/domain/commercial/entity/address.definition";

interface AddressProps {
  openUpdateModal: any;
  closeUpdateModal: () => void;
  address: IAddress;
  updateAddress: (
    addressId: string,
    newData: IAddress,
    originalAddress?: IAddress
  ) => Promise<void>;
}
export function AddressUpdateModal({
  openUpdateModal,
  closeUpdateModal,
  address,
  updateAddress,
}: AddressProps) {
  // Create a wrapper function that includes the original address
  const handleSubmit = (addressId: string, newData: IAddress) => {
    return updateAddress(addressId, newData, address);
  };

  return (
    <Modal
      open={openUpdateModal}
      onClose={closeUpdateModal}
      title="Editar endereço"
      className="bg-white"
      position="center"
    >
      <ModalContent>
        <ModalBody className="min-h-[50vh] max-h-[70vh] w-[70vh]">
          <AddressUpdateForm
            onSubmit={handleSubmit}
            address={address}
            closeModal={closeUpdateModal}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

