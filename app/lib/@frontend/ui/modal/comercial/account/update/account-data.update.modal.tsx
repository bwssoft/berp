"use client";

import React from "react";
import { Modal, ModalBody, ModalContent } from "../../../../component";
import { IAccount } from "@/app/lib/@backend/domain";
import { UpdateAccountDataForm } from "../../../../form/commercial/account/update/account-data/update-one.account-data.account.form";

interface AddressProps {
    openUpdateModal: any;
    closeUpdateModal: () => void;
    accountData?: IAccount;
}
export function AccountDataUpdateModal({
    openUpdateModal,
    closeUpdateModal,
    accountData,
}: AddressProps) {
    return (
        <Modal
            open={openUpdateModal}
            onClose={closeUpdateModal}
            title="Editar Dados da Conta"
            className="bg-white"
            position="center"
        >
            <ModalContent>
                <ModalBody className="min-h-[50vh] max-h-[70vh] w-[70vh]">
                    <UpdateAccountDataForm
                        accountData={accountData}
                        closeModal={closeUpdateModal}
                    />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
