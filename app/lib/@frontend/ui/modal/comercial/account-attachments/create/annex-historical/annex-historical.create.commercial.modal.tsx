"use client";

import {
  CreateAnnexHistoricalForm,
  Modal,
  ModalBody,
  ModalContent,
} from "@/app/lib/@frontend/ui/component";
import { useCreateAnnexHistoricalModal } from "./use-annex-historical.create.commercial.modal";

interface Props {
  open: boolean;
  closeModal: () => void;
  onFileUploadSuccess?: (fileUrl: string) => void;
}

export function CreateAnnexHistoricalModal({ open, closeModal, onFileUploadSuccess }: Props) {
  const { handleFileUploadSuccess } = useCreateAnnexHistoricalModal(onFileUploadSuccess)

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
          <CreateAnnexHistoricalForm onFileUploadSuccess={handleFileUploadSuccess} closeModal={closeModal} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
