"use client";
import { Modal, ModalBody, ModalContent } from "../../../../component";
import { EconomicGroupAccountForm } from "../../../../form/commercial/account/update/economic-group/update-one.economic-group.account.form";

interface EconomicGroupModalProps {
  open: boolean;
  onClose: () => void;
  accountId: string;
}

export function UpdateEconomicGroupAccountModal({
  accountId,
  open,
  onClose,
}: EconomicGroupModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Grupo Econômico"
      className="bg-white h-fit w-full max-w-xl"
      position="center"
    >
      <ModalContent>
        <ModalBody>
          <EconomicGroupAccountForm
            accountId={accountId}
            isModalOpen={open}
            closeModal={onClose}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
