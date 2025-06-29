"use client";
import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";
import { Modal, ModalBody, ModalContent } from "../../../../component/modal";
import { IAudit, IProfile } from "@/app/lib/@backend/domain";
import { AuditTable } from "../../../../table/admin/audit/audit.table";

interface Props {
  open: boolean;
  closeModal: () => void;
  profile?: Pick<IProfile, "id" | "name">;
  audits: PaginationResult<IAudit>;
  currentPage: number;
  handlePageChange: (page: number) => void;
}

export function AuditProfileModal({
  open,
  closeModal,
  profile,
  audits,
  currentPage,
  handlePageChange,
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
          <AuditTable
            data={audits}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </ModalContent>
      </ModalBody>
    </Modal>
  );
}
