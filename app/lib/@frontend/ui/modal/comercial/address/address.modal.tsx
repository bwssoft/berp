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
import { useAddressModal } from "./use-address.modal";

interface AddressProps {
    open: any;
}
export function AddressModal({ open }: AddressProps) {
    const { closeModal } = useAddressModal();

    return (
        <Modal
            open={open}
            onClose={closeModal}
            title="MINHAUU"
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
