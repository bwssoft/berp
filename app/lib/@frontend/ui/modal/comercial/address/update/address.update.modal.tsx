"use client";

import React from "react";
import { AddressUpdateForm } from "../../../../form/commercial/address/update";
import { Modal, ModalBody, ModalContent } from "../../../../component";
import { findManyAddress } from "@/app/lib/@backend/action";
import { IAddress } from "@/app/lib/@backend/domain";

interface AddressProps {
    open: any;
    closeModal: () => void;
    address: IAddress;
}
export function AddressUpdateModal({
    open,
    closeModal,
    address,
}: AddressProps) {
    return (
        <Modal
            open={open}
            onClose={closeModal}
            title="Editar endereço"
            className="bg-white"
            position="center"
        >
            <ModalContent>
                <ModalBody>
                    <AddressUpdateForm
                        address={address}
                        closeModal={closeModal}
                    />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
