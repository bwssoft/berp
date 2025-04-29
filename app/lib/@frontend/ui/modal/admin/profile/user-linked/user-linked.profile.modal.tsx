"use client";

import { Modal, ModalBody, ModalContent } from "../../../../component/modal";
import { IProfile, IUser } from "@/app/lib/@backend/domain";
import { ListUserDescription } from "../../../../description";

interface Props {
  open: boolean;
  closeModal: () => void;
  profile?: Pick<IProfile, "id" | "name">;
  users: IUser[];
  isLoading?: boolean;
}

export function UserLinkedProfileModal({
  users,
  open,
  closeModal,
  profile,
  isLoading,
}: Props) {
  return (
    <Modal
      position="center"
      title={`Usuários vinculados ao perfil - ${profile?.name}`}
      open={open}
      onClose={closeModal}
    >
      <ModalBody>
        <ModalContent className="overflow-y-scroll max-h-[70vh]">
          <ListUserDescription isLoading={isLoading} users={users} />
        </ModalContent>
      </ModalBody>
    </Modal>
  );
}
