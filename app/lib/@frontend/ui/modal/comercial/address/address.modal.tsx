"use client";

import React from "react";
import { Modal, ModalBody, ModalContent } from "../../../component";

import { AddressCreateForm } from "../../../form/commercial/address/create/address.create.form";
import { IAddress } from "@/app/lib/@backend/domain";

interface AddressProps {
    open: any;
    closeModal: () => void;
    accountId: string;
    defaultValues?: Partial<IAddress>;
}
export function CreatedAddressModal({
    open,
    closeModal,
    accountId,
    defaultValues,
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
                        closeModal={closeModal}
                        accountId={accountId}
                        defaultValues={defaultValues}
                    />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
