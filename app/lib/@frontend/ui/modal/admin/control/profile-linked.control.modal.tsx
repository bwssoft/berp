"use client";
import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";
import { Modal, ModalBody, ModalContent } from "../../../component/modal";
import { ListProfileDescription } from "../../../description";
import { IControl, IProfile } from "@/app/lib/@backend/domain";

interface Props {
  open: boolean;
  closeModal: () => void;
  control?: Pick<IControl, "id" | "name">;
  profiles: PaginationResult<IProfile>;
  isLoading?: boolean;
}

export function ProfileLinkedControlModal({
  open,
  closeModal,
  control,
  profiles,
  isLoading,
}: Props) {
  return (
    <Modal
      position="center"
      title={`Perfis relacionados ao controle de acesso - ${control?.name}`}
      open={open}
      onClose={closeModal}
    >
      <ModalBody>
        <ModalContent className="overflow-y-scroll max-h-[70vh]">
          <ListProfileDescription isLoading={isLoading} profiles={profiles} />
        </ModalContent>
      </ModalBody>
    </Modal>
  );
}
