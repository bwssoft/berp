"use client";

import React from "react";
import { Modal, ModalBody, ModalContent } from "../../../component";

import { AddressCreateForm } from "../../../form/commercial/address/create/address.create.form";

interface AddressProps {
    open: any;
    closeModal: () => void;
}
export function AddressModal({ open, closeModal }: AddressProps) {
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
                    <AddressCreateForm closeModal={closeModal} />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
