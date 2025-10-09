"use client";
import {IAudit} from "@/app/lib/@backend/domain/admin/entity/audit.definition";
import {IControl} from "@/app/lib/@backend/domain/admin/entity/control.definition";
import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";
import { Modal, ModalBody, ModalContent } from "../../../../component/modal";
import { AuditTable } from "../../../../table/admin/audit/audit.table";

interface Props {
  open: boolean;
  closeModal: () => void;
  control?: Pick<IControl, "id" | "name">;
  audits: PaginationResult<IAudit>;
  currentPage: number;
  handleChangePage: (page: number) => void;
  isLoading?: boolean;
}

export function AuditByControlCodeProfileModal({
  open,
  closeModal,
  control,
  audits,
  handleChangePage,
  currentPage,
  isLoading,
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
          <AuditTable
            data={audits}
            handlePageChange={handleChangePage}
            currentPage={currentPage}
            isLoading={isLoading}
          />
        </ModalContent>
      </ModalBody>
    </Modal>
  );
}
