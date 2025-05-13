"use client";

import React from "react";
import {
    Button,
    Checkbox,
    Input,
    Modal,
    ModalBody,
    ModalContent,
} from "../../../component";

import { AddressCreateForm } from "../../../form/commercial/address/create/address.create.form";
import { useAddressModal } from "./use-address.comercial.modal";

export function AddressModal() {
    const { open, closeModal } = useAddressModal();

    return (
        <Modal
            open={open}
            onClose={closeModal}
            title="Novo tipo de setor"
            className="bg-white"
            position="center"
        >
            <ModalContent>
                <ModalBody>
                    <AddressCreateForm />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
