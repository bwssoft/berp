"use client";
import { Modal, ModalBody, ModalContent } from "../../../../component/modal";
import { AuditTable } from "../../../../table/admin/audit";
import { IAudit, IProfile } from "@/app/lib/@backend/domain";

interface Props {
  open: boolean;
  closeModal: () => void;
  profile?: Pick<IProfile, "id" | "name">;
  audits: IAudit[];
}

export function AuditProfileModal({
  open,
  closeModal,
  profile,
  audits,
}: Props) {
  return (
    <Modal
      position="center"
      title={`Histório de alterações de perfil - ${profile?.name}`}
      open={open}
      onClose={closeModal}
    >
      <ModalBody>
        <ModalContent className="overflow-y-scroll max-h-[70vh]">
          <AuditTable data={audits} />
        </ModalContent>
      </ModalBody>
    </Modal>
  );
}