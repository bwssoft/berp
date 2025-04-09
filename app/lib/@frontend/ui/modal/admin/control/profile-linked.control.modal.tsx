"use client";
import { UserTable } from "../../../table/admin/user";
import { Modal, ModalBody, ModalContent } from "../../../component/modal";
import { use } from "react";
import { useProfileLinkedControlModal } from "./use-profile-linked.control.modal";
import { ProfileTable } from "../../../table";

interface Props {
  open: boolean;
  codeControl: string
  onClose: () => void;
}

export function ProfileLinkedControlModal({
    open,
    codeControl,
    onClose,
  }: Props) {
      const { profiles } = useProfileLinkedControlModal(codeControl)
  
    return (
      <Modal position="center" title="Perfis relacionados ao controle de acesso" open={open} onClose={onClose} >
        <ModalBody>
          <ModalContent className="overflow-y-scroll max-h-[70vh]">
              <ProfileTable data={profiles ?? []}/>
          </ModalContent>
        </ModalBody>
      </Modal>
    );
}
