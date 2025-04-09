"use client";

import { UserTable } from "../../../../table/admin/user";
import { Modal, ModalBody, ModalContent } from "../../../../component/modal";
import { useUserLinkedProfileModal } from "./use-user-linked.profile.modal";

interface Props {
  open: boolean;
  nameProfile: string
  onClose: () => void;
}

export function UserLinkedProfileModal({
  open,
  nameProfile,
  onClose,
}: Props) {
    const { users } = useUserLinkedProfileModal(nameProfile)

  return (
    <Modal position="center" title="Usuários vinculados ao perfil" open={open} onClose={onClose} >
      <ModalBody>
      <ModalContent className="overflow-y-scroll max-h-[70vh]">
            <UserTable data={users ?? []}/>
        </ModalContent>
      </ModalBody>
    </Modal>
  );
}
