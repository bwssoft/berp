"use client";

import { UserTable } from "../../../../table/admin/user";
import { Modal, ModalBody, ModalContent } from "../../../../component/modal";
import { useUserLinkedProfileModal } from "./use-user-linked.profile.modal";

interface Props {
  nameProfile: string
}

export function UserLinkedProfileModal({
  nameProfile,
}: Props) {
    const { users, open, setOpen } = useUserLinkedProfileModal(nameProfile)

  return (
    <Modal 
      position="center" 
      title="Usuários vinculados ao perfil" 
      open={open} 
      onClose={() => setOpen(prev => !prev)} 
    >
      <ModalBody>
      <ModalContent className="overflow-y-scroll max-h-[70vh]">
            <UserTable data={users ?? []}/>
        </ModalContent>
      </ModalBody>
    </Modal>
  );
}
