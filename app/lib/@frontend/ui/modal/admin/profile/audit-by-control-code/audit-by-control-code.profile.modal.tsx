"use client";
import { Modal, ModalBody, ModalContent } from "../../../../component/modal";
import { useAuditByControlCodeProfileModal } from "./use-audit-by-control-code.profile.modal";
import { AuditTable } from "../../../../table/admin/audit";

interface Props {
  open: boolean;
  acessCode: string
  idProfile: string
  onClose: () => void;
}

export function AuditByControlCodeProfileModal({
  open,
  acessCode,
  onClose,
  idProfile
}: Props) {
    const { audits } = useAuditByControlCodeProfileModal(acessCode, idProfile)

  return (
    <Modal position="center" title="Usuários vinculados ao perfil" open={open} onClose={onClose} >
      <ModalBody>
      <ModalContent className="overflow-y-scroll max-h-[70vh]">
            <AuditTable data={audits ?? []}/>
        </ModalContent>
      </ModalBody>
    </Modal>
  );
}
