"use client";
import { Modal, ModalBody, ModalContent } from "../../../../component/modal";
import { useAuditByControlCodeProfileModal } from "./use-audit-by-control-code.profile.modal";
import { AuditTable } from "../../../../table/admin/audit";
import { IAudit, IControl } from "@/app/lib/@backend/domain";
import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";

interface Props {
  open: boolean;
  closeModal: () => void;
  control?: Pick<IControl, "id" | "name">;
  audits: PaginationResult<IAudit>;
}

export function AuditByControlCodeProfileModal({
  open,
  closeModal,
  control,
  audits,
}: Props) {
  return (
    <Modal
      position="center"
      title={`Histório de alterações de perfis com o módulo - ${control?.name}`}
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
