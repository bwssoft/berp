"use client";

import { UserTable } from "../../../../table/admin/user";
import { Modal, ModalBody, ModalContent } from "../../../../component/modal";
import { IProfile, IUser } from "@/app/lib/@backend/domain";

interface Props {
  open: boolean;
  closeModal: () => void;
  profile?: Pick<IProfile, "id" | "name">
  users: IUser[]
}

export function UserLinkedProfileModal({ users, open, closeModal, profile }: Props) {
  return (
    <Modal
      position="center"
      title={`Usuários vinculados ao perfil - ${profile?.name}`}
      open={open}
      onClose={closeModal}
    >
      <ModalBody>
        <ModalContent className="overflow-y-scroll max-h-[70vh]">
          <UserTable  data={users} />
        </ModalContent>
      </ModalBody>
    </Modal>
  );
}
