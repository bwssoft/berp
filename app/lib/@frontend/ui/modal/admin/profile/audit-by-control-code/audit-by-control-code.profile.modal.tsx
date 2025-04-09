"use client";
import { Modal, ModalBody, ModalContent } from "../../../../component/modal";
import { useAuditByControlCodeProfileModal } from "./use-audit-by-control-code.profile.modal";
import { AuditTable } from "../../../../table/admin/audit";

interface Props {
  acessCode: string
  idProfile: string
}

export function AuditByControlCodeProfileModal({
  acessCode,
  idProfile
}: Props) {
    const { open, setOpen, audits} = useAuditByControlCodeProfileModal(acessCode, idProfile)

  return (
    <Modal position="center" title="Usuários vinculados ao perfil" open={open} onClose={() => setOpen(prev => !prev)} >
      <ModalBody>
      <ModalContent className="overflow-y-scroll max-h-[70vh]">
            <AuditTable data={audits ?? []}/>
        </ModalContent>
      </ModalBody>
    </Modal>
  );
}
