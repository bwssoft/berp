"use client";

import React from "react";
import { Modal, ModalBody, ModalContent } from '@/frontend/ui/component/modal';

import {IAccount} from "@/backend/domain/commercial/entity/account.definition";
import { UpdateAccountDataForm } from "../../../../form/commercial/account/update/account-data/update-one.account-data.account.form";

interface AddressProps {
  openUpdateModal: any;
  closeUpdateModal: () => void;
  accountData?: IAccount;
  lgpdPermissions?: {
    fullLgpdAccess?: boolean;
    partialLgpdAccess?: boolean;
  };
}
export function AccountDataUpdateModal({
  openUpdateModal,
  closeUpdateModal,
  accountData,
  lgpdPermissions,
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
        <ModalBody className="w-full">
          <UpdateAccountDataForm
            accountData={accountData}
            closeModal={closeUpdateModal}
            lgpdPermissions={lgpdPermissions}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

