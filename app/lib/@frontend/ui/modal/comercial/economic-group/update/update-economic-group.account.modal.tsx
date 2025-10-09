"use client";
import { Modal, ModalBody, ModalContent } from '@/frontend/ui/component/modal';

import { EconomicGroupAccountForm } from "../../../../form/commercial/account/update/economic-group/update-one.economic-group.account.form";
import {EconomicGroup} from "@/app/lib/@backend/domain/commercial/entity/account.economic-group.definition";

interface EconomicGroupModalProps {
  open: boolean;
  onClose: () => void;
  accountId: string;
  economicGroupHolding?: EconomicGroup;
  economicGroupControlled?: EconomicGroup[];
  economicGroupId?: string;
}

export function UpdateEconomicGroupAccountModal({
  accountId,
  open,
  onClose,
  economicGroupHolding,
  economicGroupControlled,
  economicGroupId,
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
            economicGroupHolding={economicGroupHolding}
            economicGroupControlled={economicGroupControlled}
            economicGroupId={economicGroupId}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
