"use client";

import { Modal, ModalBody, ModalContent } from "../../../../component/modal";
import {IProfile} from "@/backend/domain/admin/entity/profile.definition";
import {IUser} from "@/backend/domain/admin/entity/user.definition";
import { ListUserDescription } from '@/frontend/ui/description/admin/user/list-user.description';

import { PaginationResult } from "@/backend/domain/@shared/repository/pagination.interface";

interface Props {
  open: boolean;
  closeModal: () => void;
  profile?: Pick<IProfile, "id" | "name">;
  users: PaginationResult<IUser>;
  isLoading?: boolean;
  handlePageChange: (page: number) => void;
  currentPage: number;
}

export function UserLinkedProfileModal({
  users,
  open,
  closeModal,
  profile,
  isLoading,
  handlePageChange,
  currentPage
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
          <ListUserDescription
            isLoading={isLoading}
            users={users}
            handlePageChange={handlePageChange}
            currentPage={currentPage}
          />
        </ModalContent>
      </ModalBody>
    </Modal>
  );
}

