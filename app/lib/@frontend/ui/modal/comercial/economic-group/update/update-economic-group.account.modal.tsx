"use client";
import { Button } from "@react-email/components";
import { useUpdateEconomicGroupAccountModal } from "./use-update-economic-group.account.modal";
import { Modal, ModalBody, ModalContent } from "../../../../component";
import { EconomicGroupAccountForm } from "../../../../form/commercial/account/update/economic-group/update-one.economic-group.account.form";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

export function UpdateEconomicGroupAccountModal() {
  const { closeModal, openModal, open } = useUpdateEconomicGroupAccountModal();
  return (
    <>
      {true && (
        <Button onClick={openModal}>
          <PencilSquareIcon className="w-5 h-5 cursor-pointer" />
        </Button>
      )}

      <Modal
        open={open}
        onClose={closeModal}
        title="Grupo Econômico"
        className="bg-white h-full max-h-[70vh]"
        position="center"
      >
        <ModalContent>
          <ModalBody>
            <EconomicGroupAccountForm />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
