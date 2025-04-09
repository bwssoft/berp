"use client";
import { UserTable } from "../../../table/admin/user";
import { Modal, ModalBody, ModalContent } from "../../../component/modal";
import { use } from "react";
import { useProfileLinkedControlModal } from "./use-profile-linked.control.modal";
import { ProfileTable } from "../../../table";

interface Props {
  codeControl: string
}

export function ProfileLinkedControlModal({
    codeControl,
  }: Props) {
      const { profiles, setOpen, open } = useProfileLinkedControlModal(codeControl)
  
    return (
      <Modal position="center" title="Perfis relacionados ao controle de acesso" open={open} onClose={() => setOpen(prev => !prev)} >
        <ModalBody>
          <ModalContent className="overflow-y-scroll max-h-[70vh]">
              <ProfileTable data={profiles ?? []}/>
          </ModalContent>
        </ModalBody>
      </Modal>
    );
}
