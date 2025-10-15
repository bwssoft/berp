"use client";

import { CreateAnnexHistoricalForm } from '@/frontend/ui/form/commercial/account/account-attachments/create/annex-historical/create-historical.annex.form';
import { Modal, ModalBody, ModalContent } from '@/frontend/ui/component/modal';

import { useCreateAnnexHistoricalModal } from "./use-annex-historical.create.commercial.modal";

interface Props {
    open: boolean;
    closeModal: () => void;
    onFileUploadSuccess?: (name: string, url: string, id: string) => void;
    accountId: string;
}

export function CreateAnnexHistoricalModal({
    open,
    closeModal,
    onFileUploadSuccess,
    accountId,
}: Props) {
    const { handleFileUploadSuccess } =
        useCreateAnnexHistoricalModal(onFileUploadSuccess);

    return (
        <Modal
            open={open}
            onClose={closeModal}
            title="Novo Anexo"
            className="bg-white w-fit max-w-2xl"
            position="center"
        >
            <ModalContent>
                <ModalBody>
                    <CreateAnnexHistoricalForm
                        closeModal={closeModal}
                        handleFileUploadSuccess={handleFileUploadSuccess}
                        accountId={accountId}
                    />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
