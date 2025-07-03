"use client";

import React from "react";
import { AddressUpdateForm } from "../../../../form/commercial/address/update";
import { Modal, ModalBody, ModalContent } from "../../../../component";
import { IAddress } from "@/app/lib/@backend/domain";

interface AddressProps {
    openUpdateModal: any;
    closeUpdateModal: () => void;
    address: IAddress;
}
export function AddressUpdateModal({
    openUpdateModal,
    closeUpdateModal,
    address,
}: AddressProps) {
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
                        address={address}
                        closeModal={closeUpdateModal}
                    />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
